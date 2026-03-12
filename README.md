# Web Search Skill 网页搜索技能

OpenClaw 免费网页搜索技能 - **无需 API Key！**

## 特性

- 🔍 **无需 API Key** - 使用浏览器自动化实现
- 🌐 **多引擎支持** - Bing、Baidu、DuckDuckGo、Google
- 📊 **结构化结果** - 返回标题、URL、摘要、来源
- 🔄 **智能引擎选择** - 根据语言自动推荐
- 🇨🇳 **中文支持** - Baidu 引擎专门优化中文内容

## 安装

将 `web-search` 文件夹放置在 OpenClaw 技能目录中：

```
skills/
└── web-search/
    ├── index.js
    ├── engines.js
    ├── parser.js
    ├── SKILL.md
    └── package.json
```

## 使用方法

```javascript
const { webSearch, search, formatToMarkdown } = require('./skills/web-search');

// 简单搜索
const result = await search({
  query: "最新 AI 动态 2024",
  count: 5,
  engine: "bing"
});

// 格式化为 Markdown
console.log(formatToMarkdown(result));
```

## 搜索参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|-----------|------|----------|---------|-------------|
| query | string | 是 | - | 搜索关键词 |
| count | number | 否 | 5 | 结果数量 (1-10) |
| engine | string | 否 | bing | 搜索引擎: bing, baidu, duckduckgo, google |
| language | string | 否 | auto | 语言: zh, en |

## 支持的搜索引擎

| 引擎 | 语言 | 状态 |
|--------|----------|--------|
| Bing | 英文 | ✅ 主要支持 |
| Baidu | 中文 | ✅ 主要支持 |
| DuckDuckGo | 多语言 | ✅ 支持 |
| Google | 多语言 | ⚠️ 可能触发验证码 |

## 测试

```bash
cd skills/web-search
node test.js
```

## 许可证

MIT 许可证