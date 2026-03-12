#!/usr/bin/env node

/**
 * Web Search Skill CLI
 * 无需 API Key 的网络搜索工具
 */

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
用法: npx web-search <关键词> [选项]

选项:
  --count <n>     结果数量 (默认 5)
  --engine <name> 搜索引擎: bing, duckduckgo (默认 bing)
  --json          JSON 格式输出

示例:
  npx web-search "AI latest news" --count 10
  npx web-search "Go best practices" --engine duckduckgo --json
`);
  process.exit(0);
}

const query = args.find(a => !a.startsWith('--'));
const count = parseInt(args[args.indexOf('--count') + 1]) || 5;
const engine = args[args.indexOf('--engine') + 1] || 'bing';
const jsonOutput = args.includes('--json');

// 输出提示（实际搜索由 OpenClaw browser 工具执行）
const result = {
  query,
  count,
  engine,
  message: "This skill integrates with OpenClaw browser tool. Use browser automation to perform actual search.",
  searchUrl: engine === 'duckduckgo' 
    ? `https://duckduckgo.com/?q=${encodeURIComponent(query)}`
    : `https://www.bing.com/search?q=${encodeURIComponent(query)}`
};

if (jsonOutput) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`\n🔍 搜索: ${query}`);
  console.log(`📡 引擎: ${engine}`);
  console.log(`📊 数量: ${count}`);
  console.log(`\n🔗 搜索URL: ${result.searchUrl}\n`);
}