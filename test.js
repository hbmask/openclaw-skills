#!/usr/bin/env node

/**
 * Web Search Skill - Test Suite
 * 测试搜索功能
 */

const { webSearch, search, searchMultiple, formatToMarkdown, SEARCH_ENGINES, SUPPORTED_ENGINES } = require('./index');

/**
 * 测试配置
 */
const TEST_CONFIG = {
  queries: [
    {
      text: "AI latest news 2024",
      language: "en"
    },
    {
      text: "人工智能 最新进展",
      language: "zh"
    },
    {
      text: "OpenClaw browser automation",
      language: "en"
    }
  ],
  engines: SUPPORTED_ENGINES
};

/**
 * 测试结果收集
 */
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

/**
 * 测试工具函数
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function test(name, fn) {
  try {
    fn();
    results.passed++;
    results.tests.push({ name, status: 'passed' });
    console.log(`✓ ${name}`);
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'failed', error: error.message });
    console.log(`✗ ${name}: ${error.message}`);
  }
}

/**
 * 运行所有测试
 */
async function runTests() {
  console.log('\n🧪 Web Search Skill - Test Suite\n');
  console.log('-platform:', process.platform);
  console.log('Node version:', process.version);
  console.log('Engines supported:', SUPPORTED_ENGINES.join(', '));
  console.log('\n--- Running Tests ---\n');

  // 测试 1: 基本参数验证
  test('基本参数验证 - 空查询', () => {
    const result = webSearch({});
    assert(result.success === false, '应返回失败');
    assert(result.error, '应包含错误信息');
  });

  test('基本参数验证 - 无效引擎', () => {
    const result = webSearch({ query: 'test', engine: 'invalid' });
    assert(result.success === false, '应返回失败');
    assert(result.validEngines, '应提供有效引擎列表');
  });

  // 测试 2: 引擎配置
  test('引擎配置 - 验证所有引擎', () => {
    SUPPORTED_ENGINES.forEach(engine => {
      const config = SEARCH_ENGINES[engine];
      assert(config, `引擎 ${engine} 应存在`);
      assert(config.searchUrl, `引擎 ${engine} 应有 searchUrl 方法`);
      assert(config.resultSelector, `引擎 ${engine} 应有 resultSelector`);
    });
  });

  test('引擎配置 - 默认引擎', () => {
    const result = webSearch({ query: 'test' });
    assert(result.engine === 'bing', '默认引擎应为 bing');
  });

  // 测试 3: 搜索功能
  test('搜索功能 - 有效查询', async () => {
    const result = await search({ query: 'test', count: 2, engine: 'bing' });
    assert(result.success === true, '应返回成功');
    assert(result.instruction, '应包含搜索指令');
    assert(result.instruction.query === 'test', '查询应匹配');
  });

  test('搜索功能 - 中文查询', async () => {
    const result = await search({ 
      query: '测试搜索', 
      count: 2, 
      engine: 'baidu',
      language: 'zh'
    });
    assert(result.success === true, '应返回成功');
    assert(result.instruction.engine === 'baidu', '应使用 baidu 引擎');
  });

  // 测试 4: 结果格式化
  test('结果格式化 - Markdown', () => {
    const result = {
      success: true,
      query: 'test',
      engine: 'bing',
      results: [
        { rank: 1, title: 'Test Title', url: 'https://test.com', snippet: 'Test snippet' }
      ]
    };
    const markdown = formatToMarkdown(result);
    assert(markdown.includes('## 🔍 搜索结果'), '应包含标题');
    assert(markdown.includes('Test Title'), '应包含标题内容');
  });

  test('结果格式化 - 失败结果', () => {
    const result = {
      success: false,
      error: 'Test error'
    };
    const markdown = formatToMarkdown(result);
    assert(markdown.includes('❌'), '失败结果应有错误图标');
  });

  // 测试 5: 多引擎搜索
  test('多引擎搜索 - 启动搜索', async () => {
    const results = await searchMultiple({ 
      query: 'test', 
      count: 2, 
      engines: ['bing', 'baidu'] 
    });
    assert(results.length === 2, '应返回 2 个结果');
  });

  // 测试 6: 结果数量限制
  test('结果数量限制 - 最大值', () => {
    const result = webSearch({ query: 'test', count: 100 });
    assert(result.count === 10, '应限制为最大值 10');
  });

  test('结果数量限制 - 最小值', () => {
    const result = webSearch({ query: 'test', count: 0 });
    assert(result.count === 1, '应限制为最小值 1');
  });

  test('结果数量限制 - 负值', () => {
    const result = webSearch({ query: 'test', count: -5 });
    assert(result.count === 1, '应限制为最小值 1');
  });

  // 测试 7: 工具函数
  const { recommendEngine, isValidEngine } = require('./engines');

  test('工具函数 - 语言推荐', () => {
    assert(recommendEngine('zh') === 'baidu', '中文应推荐 baidu');
    assert(recommendEngine('en') === 'bing', '英文应推荐 bing');
    assert(recommendEngine('') === 'bing', '未指定应推荐 bing');
  });

  test('工具函数 - 有效引擎验证', () => {
    assert(isValidEngine('bing') === true, 'bing 应有效');
    assert(isValidEngine('invalid') === false, '无效引擎应返回 false');
  });

  // 汇总输出
  console.log('\n--- Test Summary ---\n');
  console.log(`Total: ${results.passed + results.failed}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%\n`);
  
  if (results.failed > 0) {
    console.log('Failed Tests:');
    results.tests.filter(t => t.status === 'failed').forEach(t => {
      console.log(`  - ${t.name}: ${t.error}`);
    });
    process.exit(1);
  } else {
    console.log('✅ All tests passed!');
    process.exit(0);
  }
}

// 运行测试
runTests().catch(console.error);
