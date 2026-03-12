/**
 * Web Search - 搜索引擎配置
 * 支持 Bing, Baidu, DuckDuckGo, Google
 */

const SEARCH_ENGINES = {
  bing: {
    name: 'Bing',
    domain: 'www.bing.com',
    searchUrl: (query) => `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
    resultSelector: '.b_algo',
    titleSelector: 'h2',
    linkSelector: 'h2 a',
    snippetSelector: '.b_caption p, .b_attribution, p',
    waitForSelector: '.b_algo',
    // Bing 有时会显示 AI 摘要
    aiSummarySelector: '.b_radius, .b_block, .b_answer',
    priority: 1
  },
  
  baidu: {
    name: 'Baidu',
    domain: 'www.baidu.com',
    searchUrl: (query) => `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`,
    resultSelector: '.result, .c-container',
    titleSelector: 'h3, .t a, h3 a',
    linkSelector: 'a',
    snippetSelector: '.c-abstract, .c-span9, .c-span-last, p',
    waitForSelector: '.result',
    priority: 2
  },
  
  duckduckgo: {
    name: 'DuckDuckGo',
    domain: 'duckduckgo.com',
    searchUrl: (query) => `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
    resultSelector: '[data-testid="result"], .result, .web-result',
    titleSelector: 'h2, h2 a',
    linkSelector: 'a',
    snippetSelector: '[data-testid="result-snippet"], .result__snippet, .result__explanation',
    waitForSelector: '[data-testid="result"]',
    priority: 3
  },
  
  google: {
    name: 'Google',
    domain: 'www.google.com',
    searchUrl: (query) => `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    resultSelector: '#search .g, .tF2Cxc, .UDZeT',
    titleSelector: 'h3, h3 a',
    linkSelector: 'a',
    snippetSelector: '[data-sncf], .VwiC3b, .F9ibWe, .VwiC3b',
    waitForSelector: '#search .g',
    // Google 可能显示知识图谱或 AI 摘要
    aiSummarySelector: '[data-ATI-citelink], .kNoTB',  
    priority: 4
  }
};

/**
 * 默认搜索引擎
 */
const DEFAULT_ENGINE = 'bing';

/**
 * 支持的搜索引擎列表
 */
const SUPPORTED_ENGINES = Object.keys(SEARCH_ENGINES);

/**
 * 根据语言推荐搜索引擎
 * @param {string} language - 语言代码 (zh/en)
 * @returns {string} 推荐的搜索引擎
 */
function recommendEngine(language = '') {
  if (!language) return DEFAULT_ENGINE;
  const lang = language.toLowerCase();
  if (lang.startsWith('zh')) {
    return 'baidu';
  }
  return DEFAULT_ENGINE;
}

/**
 * 获取搜索引擎配置
 * @param {string} engineName - 搜索引擎名称
 * @returns {Object|null} 搜索引擎配置，不存在则返回 null
 */
function getEngineConfig(engineName) {
  return SEARCH_ENGINES[engineName] || null;
}

/**
 * 验证搜索引擎名称
 * @param {string} engineName - 搜索引擎名称
 * @returns {boolean} 是否有效
 */
function isValidEngine(engineName) {
  return engineName && SEARCH_ENGINES.hasOwnProperty(engineName);
}

/**
 * 提供搜索引擎降级列表
 * @param {string} primaryEngine - 主搜索引擎
 * @returns {string[]} 降级搜索引擎列表
 */
function getFallbackEngines(primaryEngine) {
  const engines = [...SUPPORTED_ENGINES];
  const index = engines.indexOf(primaryEngine);
  if (index !== -1) {
    engines.splice(index, 1);
  }
  return engines;
}

module.exports = {
  SEARCH_ENGINES,
  DEFAULT_ENGINE,
  SUPPORTED_ENGINES,
  recommendEngine,
  getEngineConfig,
  isValidEngine,
  getFallbackEngines
};
