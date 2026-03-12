---
name: web-search
description: 基于浏览器自动化的网页搜索技能 - 无需 API Key。支持 Bing、Baidu、DuckDuckGo、Google。适用于搜索最新信息、研究主题或查找特定内容。
metadata:
  openclaw:
    requires:
      bins: []
---

# Web Search Skill 网页搜索技能

免费的网页搜索技能，使用浏览器自动化 - **无需 API Key！**

## 🌟 特性

- 🔍 **无需 API Key** - 使用浏览器自动化实现
- 🌐 **多引擎支持** - Bing、Baidu、DuckDuckGo、Google
- 📊 **结构化结果** - 返回标题、URL、摘要、来源
- 🔄 **智能引擎选择** - 根据语言自动推荐引擎
- 🛡️ **错误处理** - 完善的错误处理和降级机制
- 🇨🇳 **中文支持** - Baidu 引擎专门优化中文内容
- 📝 **Markdown 输出** - 格式化结果，可直接用于对话

## 📁 文件结构

```
skills/web-search/
├── index.js          # 主逻辑 - webSearch 函数
├── engines.js        # 搜索引擎配置
├── parser.js         # 结果解析和提取
├── cli.js            # CLI 命令行接口（可选）
├── package.json      # 包元数据
├── README.md         # 快速开始指南
└── SKILL.md          # 本文档
```

## 🔧 使用场景

适用于以下情况：
- 搜索最新信息
- 研究任何主题
- 查找特定网站或内容
- 获取最新新闻和动态
- 搜索中文内容（使用 Baidu）
- 对比多个搜索引擎的结果

## 🚀 使用方法

技能提供 `webSearch` 函数，支持以下参数：

```yaml
query: "你的搜索关键词"  # 必填 - 搜索关键词
count: 5                     # 可选 - 结果数量 (1-10)
engine: "bing"              # 可选 - bing, baidu, duckduckgo, google
language: "zh"              # 可选 - zh, en（用于自动推荐引擎）
```

### 返回结果结构

```json
{
  "success": true,
  "query": "搜索关键词",
  "engine": "bing",
  "count": 5,
  "results": [
    {
      "rank": 1,
      "title": "结果标题",
      "url": "https://example.com",
      "snippet": "结果描述...",
      "source": "example.com"
    }
  ]
}
```

## 📖 使用示例

### 基础搜索（英文）
```yaml
query: "latest AI news 2024"
count: 5
```

### 高级搜索（中文）
```yaml
query: "人工智能 最新进展"
count: 10
engine: "baidu"
language: "zh"
```

### 多引擎搜索
使用 `searchMultiple` 在所有引擎上搜索：
```yaml
query: "Go language best practices"
count: 5
engines: ["bing", "baidu", "duckduckgo", "google"]
```

### 编程方式调用
```javascript
const { webSearch, search, searchMultiple, formatToMarkdown } = require('./index');

// 简单搜索
const result = await search({
  query: "OpenCLaw browser automation",
  count: 5,
  engine: "bing"
});

// 格式化为 Markdown
const markdown = formatToMarkdown(result);
console.log(markdown);

// 多引擎搜索
const results = await searchMultiple({
  query: "web search without API",
  count: 3,
  engines: ["bing", "duckduckgo"]
});
```

## 🌐 支持的搜索引擎

| 引擎 | 状态 | 语言 | 说明 |
|--------|--------|----------|-------|
| Bing | ✅ 主要支持 | 英文 | 通用搜索首选 |
| Baidu | ✅ 主要支持 | 中文 | 中文内容首选 |
| DuckDuckGo | ✅ 支持 | 多语言 | 注重隐私的替代选择 |
| Google | ⚠️ 有限支持 | 多语言 | 可能需要处理验证码 |

### 引擎推荐

| 场景 | 推荐引擎 |
|----------|-------------------|
| 英文查询 | Bing（默认） |
| 中文查询 | Baidu |
| 注重隐私 | DuckDuckGo |
| 所有引擎 | 使用 `searchMultiple` |

## ⚙️ 工作原理

本技能与 OpenClaw 内置的浏览器工具集成：

1. **查询处理** - 清理和验证搜索关键词
2. **引擎选择** - 选择合适的搜索引擎
3. **URL 生成** - 构建搜索引擎 URL
4. **浏览器自动化** - 打开 URL 并获取快照
5. **结果解析** - 从 DOM 中提取结构化结果
6. **输出格式化** - 返回格式化的结果

### 搜索流程

```
用户请求
    ↓
[验证查询] → 有效?
    ↓ 是          ↓ 否
[选择引擎]  返回错误
    ↓
[构建搜索 URL]
    ↓
[浏览器：打开 URL]
    ↓
[浏览器：获取快照]
    ↓
[解析结果]
    ↓
[返回结构化数据]
```

## 🛠️ 错误处理

技能包含完善的错误处理机制：

| 错误类型 | 处理策略 |
|------------|-------------------|
| 无效查询 | 返回错误并提供建议 |
| 未知引擎 | 返回错误并列出有效引擎 |
| 空结果 | 返回成功状态和空数组 |
| 浏览器超时 | 建议使用备用引擎 |
| DOM 解析失败 | 使用备用解析方法 |

### 错误响应格式

```json
{
  "success": false,
  "error": "错误信息",
  "suggestions": "有用的建议",
  "validEngines": ["bing", "baidu", "duckduckgo", "google"]
}
```

## 📊 CLI 命令行使用

```bash
# 基础搜索
node index.js "搜索关键词"

# 高级选项
node index.js "搜索关键词" --count 10 --engine bing --language zh

# JSON 输出
node index.js "搜索关键词" --json

# 多引擎搜索
node index.js "搜索关键词" --multi

# 帮助信息
node index.js --help
```

## 🔍 结果解析器

解析器使用多种策略：

1. **主要解析** - 使用引擎特定的选择器
2. **备用解析** - 如果主要解析失败，使用通用 DOM 遍历
3. **结果去重** - 移除重复结果
4. **字段提取** - 标题、URL、摘要、来源

### 解析器函数

| 函数 | 用途 |
|----------|---------|
| `parseSearchResults` | 主要结果提取 |
| `filterResults` | 过滤无效结果 |
| `formatOutput` | 格式化为结构化数据 |
| `generateSummary` | 生成结果摘要 |

## 📝 输出格式

### Markdown 格式
```markdown
## 🔍 搜索结果 (Bing)
**搜索关键词**: AI 最新动态
**结果数量**: 5

### 1. AI 新闻 2024
**URL**: https://example.com
**来源**: example.com
**摘要**: 最新 AI 发展动态...
```

### JSON 格式
```json
{
  "success": true,
  "query": "AI 最新动态",
  "engine": "bing",
  "count": 5,
  "results": [...]
}
```

## 🎯 最佳实践

1. **根据语言选择合适的引擎**
   - 英文查询 → Bing（默认）
   - 中文查询 → Baidu

2. **调整结果数量参数**
   - 快速查找用 3-5 条结果
   - 深度调研用 10 条结果

3. **处理空结果**
   - 检查 `success` 和 `results.length`
   - 必要时尝试其他引擎

4. **适当缓存结果**
   - 搜索结果不会频繁变化
   - 重复查询可考虑缓存

## 🚨 已知限制

1. **验证码保护**
   - Google 可能需要验证码
   - 建议使用 Bing 或 Baidu 以保证稳定性
   - 注意控制请求频率

2. **DOM 结构变化**
   - 搜索引擎可能更新页面布局
   - 解析器可能需要更新
   - 关注引擎更新日志

3. **语言限制**
   - 结果可能是不同语言
   - 使用 `language` 参数影响结果
   - Baidu 最适合中文内容

## 📦 安装

技能设计为在 OpenClaw 技能框架内工作：

```
skills/
└── web-search/
    ├── index.js
    ├── engines.js
    ├── parser.js
    ├── SKILL.md
    └── package.json
```

无需额外依赖！

## 🤝 贡献

欢迎贡献！改进方向：

- 添加更多搜索引擎
- 提高解析可靠性
- 添加缓存层
- 支持搜索过滤器
- 添加结果排序

## 📄 许可证

MIT 许可证 - 免费开源

---

**无需 API Key。无限制。尽情搜索。** 🚀