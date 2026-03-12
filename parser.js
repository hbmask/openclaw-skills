/**
 * Web Search - 结果解析器
 * 从浏览器快照中提取结构化搜索结果
 */

/**
 * 解析搜索结果
 * @param {Object} snapshot - 浏览器快照数据
 * @param {Object} engineConfig - 搜索引擎配置
 * @param {number} maxResults - 最大结果数量
 * @returns {Array} 解析后的结果数组
 */
function parseSearchResults(snapshot, engineConfig, maxResults = 10) {
  if (!snapshot || !snapshot.aria) {
    return [];
  }

  const results = [];
  const engine = engineConfig || {};
  
  // 尝试多种容器选择器
  const containerSelectors = [
    engine.resultSelector || '.b_algo',
    '#search .g',
    '.web-result',
    '.result'
  ];

  // 查找所有结果容器
  const containers = findElements(snapshot, containerSelectors);
  
  for (const container of containers) {
    const result = parseResultContainer(container, engine, snapshot);
    if (result && result.title && result.url) {
      results.push(result);
      if (results.length >= maxResults) {
        break;
      }
    }
  }

  // 如果没有找到结果，尝试备用解析方法
  if (results.length === 0) {
    const backupResults = parseBackup-methods(snapshot, maxResults);
    if (backupResults.length > 0) {
      return backupResults;
    }
  }

  return results;
}

/**
 * 从容器中解析单个结果
 */
function parseResultContainer(container, engine, snapshot) {
  if (!container) return null;

  const result = {
    title: '',
    url: '',
    snippet: '',
    source: '',
    originalHtml: container.outerHTML || ''
  };

  // 提取标题
  const titleSelectors = [
    engine.titleSelector || 'h2',
    'h3',
    '.title',
    '.result__title'
  ];
  const titleEl = findElement(container, titleSelectors);
  if (titleEl) {
    result.title = titleEl.text || titleEl.innerHTML || '';
    // 清理标题
    result.title = result.title.replace(/\s+/g, ' ').trim();
  }

  // 提取 URL
  const linkSelectors = [
    engine.linkSelector || 'a',
    'a[href]'
  ];
  const linkEl = findElement(container, linkSelectors);
  if (linkEl && linkEl.attributes && linkEl.attributes.href) {
    result.url = linkEl.attributes.href;
    result.source = extractDomain(result.url);
  }

  // 提取摘要
  const snippetSelectors = [
    engine.snippetSelector || '.b_caption p',
    '.description',
    '.c-abstract',
    '[data-sncf]',
    '.VwiC3b',
    'p'
  ];
  const snippetEl = findElement(container, snippetSelectors);
  if (snippetEl) {
    result.snippet = snippetEl.text || snippetEl.innerHTML || '';
    // 清理摘要
    result.snippet = result.snippet.replace(/\s+/g, ' ').trim();
    // 截断到合理长度
    if (result.snippet.length > 200) {
      result.snippet = result.snippet.substring(0, 200) + '...';
    }
  }

  // 验证结果有效性
  if (!result.title && !result.snippet) {
    return null;
  }

  return result;
}

/**
 * 使用备用方法解析结果
 */
function parseBackupMethods(snapshot, maxResults) {
  const results = [];
  
  // 方法1: 查找所有链接和文本
  const allLinks = findElements(snapshot, ['a', '[href]']);
  
  for (const link of allLinks) {
    if (results.length >= maxResults) break;
    
    // 跳过导航和重复链接
    if (isNavigationLink(link)) continue;
    
    const parent = link.parentElement;
    if (!parent) continue;

    // 检查是否有 snippet 附近的文本
    const snippet = findElement(parent, ['p', 'span', 'div']) || link;
    
    const result = {
      title: link.text || link.innerHTML || '',
      url: link.attributes?.href || '',
      snippet: snippet.text || snippet.innerHTML || '',
      source: extractDomain(link.attributes?.href || ''),
      rank: results.length + 1
    };

    if (result.title && result.url && !result.url.startsWith('javascript:')) {
      results.push(result);
    }
  }

  return results;
}

/**
 * 查找元素（支持多个选择器）
 */
function findElements(snapshot, selectors) {
  if (!snapshot.aria) return [];

  // 在 DOM 树中查找
  const elements = [];
  
  for (const selector of selectors) {
    const found = findElementsBySelector(snapshot, selector);
    elements.push(...found);
  }

  // 去重
  const uniqueElements = [];
  const seen = new Set();
  for (const el of elements) {
    if (!seen.has(el.uniqueId)) {
      seen.add(el.uniqueId);
      uniqueElements.push(el);
    }
  }

  return uniqueElements;
}

/**
 * 根据选择器查找元素
 */
function findElementsBySelector(snapshot, selector) {
  if (!snapshot.aria) return [];

  const found = [];
  
  // 简化的 DOM 遍历实现
  function traverse(node, depth = 0) {
    if (!node || depth > 10) return;

    // 检查当前节点是否匹配选择器
    if (matchesSelector(node, selector)) {
      found.push(node);
    }

    // 遍历子节点
    if (node.children) {
      for (const child of node.children) {
        traverse(child, depth + 1);
      }
    }
  }

  traverse(snapshot.aria);
  return found;
}

/**
 * 简单的选择器匹配
 */
function matchesSelector(node, selector) {
  if (!node) return false;

  // 简化的选择器匹配
  const parts = selector.split(/[.#]/);
  const tagNameMatch = parts[0] ? node.role?.toLowerCase() === parts[0].toLowerCase() : true;
  
  // 如果有 ID 或 class，进行匹配
  if (selector.includes('#')) {
    return tagNameMatch && node.name === selector.split('#')[1];
  }
  if (selector.includes('.')) {
    return tagNameMatch;
  }
  
  return tagNameMatch;
}

/**
 * 查找单个元素
 */
function findElement(container, selectors) {
  if (!container) return null;
  return findElements({ aria: container }, selectors)[0] || null;
}

/**
 * 提取域名
 */
function extractDomain(url) {
  try {
    if (!url) return 'unknown';
    if (url.startsWith('javascript:')) return 'internal';
    
    // 简单的 URL 解析
    let cleanUrl = url.split('?')[0].split('#')[0];
    
    // 移除协议
    cleanUrl = cleanUrl.replace('https://', '').replace('http://', '');
    
    // 获取域名
    const parts = cleanUrl.split('/');
    return parts[0] || 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * 检测是否为导航链接
 */
function isNavigationLink(link) {
  if (!link) return false;
  const url = link.attributes?.href || '';
  return url.startsWith('#') || url.startsWith('javascript:') || url.startsWith('mailto:');
}

/**
 * 生成结果摘要
 */
function generateSummary(title, snippet) {
  // 如果有 snippet，优先使用
  if (snippet && snippet.length > 0) {
    return snippet;
  }
  
  // 如果只有标题，返回标题
  if (title && title.length > 0) {
    return title;
  }
  
  return 'No description available';
}

/**
 * 过滤和优化结果
 */
function filterResults(results) {
  return results.filter(result => {
    // 过滤没有标题或 URL 的结果
    if (!result.title || !result.url) return false;
    
    // 过滤内部链接
    if (result.url.startsWith('javascript:') || result.url.startsWith('#')) {
      return false;
    }
    
    // 过滤重复的 URL
    return true;
  }).map((result, index) => ({
    ...result,
    rank: index + 1
  }));
}

/**
 * 格式化输出
 */
function formatOutput(results, engine) {
  return {
    engine: engine,
    count: results.length,
    results: results.map(r => ({
      rank: r.rank,
      title: r.title,
      url: r.url,
      snippet: r.snippet,
      source: r.source
    }))
  };
}

module.exports = {
  parseSearchResults,
  parseResultContainer,
  parseBackupMethods,
  extractDomain,
  generateSummary,
  filterResults,
  formatOutput
};
