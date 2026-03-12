#!/usr/bin/env node

/**
 * Web Search Skill - 完整实现
 * 支持 Bing, Baidu, DuckDuckGo, Google
 * 无需 API Key
 */

const { SEARCH_ENGINES, DEFAULT_ENGINE, SUPPORTED_ENGINES, recommendEngine, isValidEngine, getFallbackEngines } = require('./engines');
const {
  parseSearchResults,
  filterResults,
  formatOutput,
  generateSummary
} = require('./parser');

/**
 * 搜索相关常量
 */
const MAX_RESULTS = 10;
const MIN_RESULTS = 1;

/**
 * Web Search 主函数
 * @param {Object} params - 搜索参数
 * @param {string} params.query - 搜索关键词
 * @param {number} params.count - 结果数量 (1-10)
 * @param {string} params.engine - 搜索引擎 (bing/baidu/duckduckgo/google)
 * @param {string} params.language - 语言代码 (zh/en)，用于推荐搜索引擎
 * @returns {Object} 搜索指令对象
 */
function webSearch(params) {
  const { query, count = 5, engine: engineName, language } = params;
  
  // 参数验证
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return {
      success: false,
      error: '搜索关键词不能为空',
      suggestions: '请输入有效的搜索关键词'
    };
  }

  // 清理查询
  const cleanQuery = query.trim();
  
  // 处理 count 参数
  let finalCount = parseInt(count);
  if (isNaN(finalCount) || finalCount < MIN_RESULTS) {
    finalCount = MIN_RESULTS;
  }
  if (finalCount > MAX_RESULTS) {
    finalCount = MAX_RESULTS;
  }

  // 确定搜索引擎
  let finalEngine = engineName || DEFAULT_ENGINE;
  
  // 如果未指定引擎，根据语言推荐
  if (!engineName && language) {
    finalEngine = recommendEngine(language);
  }
  
  // 验证引擎
  if (!isValidEngine(finalEngine)) {
    return {
      success: false,
      error: `不支持的搜索引擎: ${finalEngine}`,
      validEngines: SUPPORTED_ENGINES,
      fallbackEngine: DEFAULT_ENGINE
    };
  }

  const engineConfig = SEARCH_ENGINES[finalEngine];
  
  // 返回搜索指令
  return {
    success: true,
    action: 'browser_search',
    query: cleanQuery,
    count: finalCount,
    engine: finalEngine,
    engineName: engineConfig.name,
    language: language || 'auto',
    searchUrl: engineConfig.searchUrl(cleanQuery),
    selectors: {
      results: engineConfig.resultSelector,
      title: engineConfig.titleSelector,
      link: engineConfig.linkSelector,
      snippet: engineConfig.snippetSelector
    },
    instructions: `
**Web Search 任务**

使用 OpenClaw browser 工具执行以下步骤:

1. 打开 URL: ${engineConfig.searchUrl(cleanQuery)}
2. 等待页面加载完成 (建议 timeoutMs: 10000)
3. 使用 snapshot 获取页面结构
4. 从 DOM 中提取搜索结果:
   - 结果容器选择器: ${engineConfig.resultSelector}
   - 标题选择器: ${engineConfig.titleSelector}
   - 链接选择器: ${engineConfig.linkSelector}
   - 摘要选择器: ${engineConfig.snippetSelector}
5. 解析并返回前 ${finalCount} 条结果

**结果格式要求**:
- 返回 JSON 格式
- 每条结果包含: title, url, snippet, source
- source 字段为 URL 的域名部分

**错误处理**:
- 如果页面加载超时，请重试
- 如果遇到验证码，请尝试其他搜索引擎: ${SUPPORTED_ENGINES.join(', ')}
- 如果结果为空，请扩大搜索范围
    `.trim(),
    fallbackEngines: getFallbackEngines(finalEngine)
  };
}

/**
 * 解析浏览器快照结果
 * @param {Object} snapshot - 浏览器快照数据
 * @param {Object} searchOptions - 搜索选项
 * @returns {Object} 解析后的结果
 */
function parseResults(snapshot, searchOptions) {
  if (!snapshot || !snapshot.aria) {
    return {
      success: false,
      error: '无效的快照数据',
      results: []
    };
  }

  const { query, count = 5, engine } = searchOptions;
  const engineConfig = SEARCH_ENGINES[engine];
  
  if (!engineConfig) {
    return {
      success: false,
      error: `未知的搜索引擎: ${engine}`,
      engine: engine
    };
  }

  // 解析结果
  let rawResults = parseSearchResults(snapshot, engineConfig, count);
  
  // 过滤和优化结果
  rawResults = filterResults(rawResults);
  
  // 如果结果不够，尝试备用解析方法
  if (rawResults.length < count) {
    const backupResults = parseSearchResults(snapshot, engineConfig, count * 2);
    rawResults = rawResults.concat(filterResults(backupResults));
  }

  // 限制结果数量
  rawResults = rawResults.slice(0, count);

  return {
    success: true,
    query: query,
    engine: engine,
    count: rawResults.length,
    results: rawResults.map((r, i) => ({
      rank: i + 1,
      title: r.title || '',
      url: r.url || '',
      snippet: generateSummary(r.title, r.snippet),
      source: r.source || ''
    }))
  };
}

/**
 * 执行搜索（完整流程）
 * @param {Object} params - 搜索参数
 * @returns {Promise<Object>} 搜索结果
 */
async function search(params) {
  try {
    // 创建搜索指令
    const searchInstruction = webSearch(params);
    
    if (!searchInstruction.success) {
      return searchInstruction;
    }

    return {
      success: true,
      instruction: searchInstruction,
      message: `搜索指令已准备。请使用 browser 工具执行: ${searchInstruction.action}`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stack: error.stack
    };
  }
}

/**
 * 批量搜索（多搜索引擎）
 * @param {Object} params - 搜索参数
 * @returns {Promise<Array>} 各搜索引擎的结果
 */
async function searchMultiple(params) {
  const { query, count = 5, engines } = params;
  
  if (!query) {
    return [{
      success: false,
      error: '搜索关键词不能为空'
    }];
  }

  const targetEngines = engines || SUPPORTED_ENGINES;
  const results = [];

  for (const engine of targetEngines) {
    if (!isValidEngine(engine)) {
      results.push({
        engine: engine,
        success: false,
        error: '不支持的搜索引擎'
      });
      continue;
    }

    try {
      const result = search({ query, count, engine });
      results.push(result);
    } catch (error) {
      results.push({
        engine: engine,
        success: false,
        error: error.message
      });
    }
  }

  return results;
}

/**
 * 格式化输出结果为 Markdown
 * @param {Object} result - 搜索结果
 * @returns {string} Markdown 格式
 */
function formatToMarkdown(result) {
  if (!result.success) {
    return `❌ 搜索失败: ${result.error || '未知错误'}`;
  }

  let output = `## 🔍 搜索结果 (${result.engine})\n`;
  output += `**搜索关键词**: ${result.query || ''}\n`;
  output += `**结果数量**: ${result.count}/${result.results?.length || 0}\n\n`;
  
  if (!result.results || result.results.length === 0) {
    output += `⚠️ 未找到相关结果\n`;
    return output;
  }

  result.results.forEach((item, index) => {
    output += `### ${item.rank}. ${item.title || '无标题'}\n`;
    output += `**URL**: ${item.url || ''}\n`;
    output += `**来源**: ${item.source || ''}\n`;
    output += `**摘要**: ${item.snippet || '无摘要'}\n\n`;
  });

  return output;
}

/**
 * CLI 入口
 */
function cli() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
🔍 Web Search Skill - 无需 API Key 的 Web 搜索工具

用法:
  node index.js <query> [选项]

参数:
  query          搜索关键词（必需）

选项:
  --count <n>    结果数量 (1-10，默认 5)
  --engine <n>   搜索引擎: bing, baidu, duckduckgo, google (默认: bing)
  --language <l> 语言代码: zh, en (用于推荐搜索引擎)
  --json         JSON 格式输出
  --format <f>   输出格式: markdown, json (默认: markdown)
  --multi        使用多个搜索引擎搜索
  --help, -h     显示帮助信息

支持的搜索引擎:
  - bing        (默认，英文搜索推荐)
  - baidu       (中文搜索推荐)
  - duckduckgo  (隐私保护)
  - google      (可能触发验证码)

示例:
  node index.js "AI latest news" --count 10
  node index.js "Go best practices" --engine duckduckgo --json
  node index.js "人工智能" --language zh --format markdown
  node index.js "web development" --multi

无 API Key，完全免费！
`);
    process.exit(0);
  }

  // 解析参数
  const query = args.find(a => !a.startsWith('--')) || '';
  const count = parseInt(args.find((v, i, a) => a[i - 1] === '--count') || '5');
  const engine = args.find((v, i, a) => a[i - 1] === '--engine') || 'bing';
  const language = args.find((v, i, a) => a[i - 1] === '--language') || '';
  const jsonOutput = args.includes('--json');
  const format = args.find((v, i, a) => a[i - 1] === '--format') || 'markdown';
  const multiEngine = args.includes('--multi');

  // 执行搜索
  if (multiEngine) {
    searchMultiple({ query, count, engines: SUPPORTED_ENGINES })
      .then(results => {
        if (jsonOutput) {
          console.log(JSON.stringify(results, null, 2));
        } else {
          results.forEach(r => {
            console.log(formatToMarkdown(r));
            console.log('---\n');
          });
        }
      });
  } else {
    search({ query, count, engine, language })
      .then(result => {
        if (jsonOutput) {
          console.log(JSON.stringify(result, null, 2));
        } else {
          console.log(formatToMarkdown(result));
        }
      });
  }
}

// 自动执行 CLI（如果直接运行此文件）
if (require.main === module) {
  cli();
}

module.exports = {
  webSearch,
  search,
  searchMultiple,
  parseResults,
  formatToMarkdown,
  cli,
  SEARCH_ENGINES,
  DEFAULT_ENGINE,
  SUPPORTED_ENGINES,
  MAX_RESULTS,
  MIN_RESULTS
};
