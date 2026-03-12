---
name: web-search
description: Web search skill using browser automation - no API key required. Supports Bing, Baidu, DuckDuckGo, Google. Use when you need to search the web for current information, research topics, or find specific content.
metadata:
  openclaw:
    requires:
      bins: []
---

# Web Search Skill

A free web search skill that uses browser automation - **no API key required!**

## 🌟 Features

- 🔍 **No API Key Required** - Uses browser automation
- 🌐 **Multi-Engine Support** - Bing, Baidu, DuckDuckGo, Google
- 📊 **Structured Results** - Returns title, URL, snippet, source
- 🔄 **Smart Engine Selection** - Auto-recommend based on language
- 🛡️ **Error Handling** - Graceful error handling and fallback
- 🇨🇳 **Chinese Support** - Baidu for Chinese content
- 📝 **Markdown Output** - Formatted results ready for chat

## 📁 File Structure

```
skills/web-search/
├── index.js          # Main logic - webSearch function
├── engines.js        # Search engine configurations
├── parser.js         # Result parsing and extraction
├── cli.js            # CLI interface (optional)
├── package.json      # Package metadata
├── README.md         # Quick start guide
└── SKILL.md          # This documentation
```

## 🔧 When to Use

Use this skill when you need to:
- Search for current information
- Research on any topic
- Find specific websites or content
- Get latest news and updates
- Search Chinese content (use Baidu)
- Compare results across multiple search engines

## 🚀 Usage

The skill provides the `webSearch` function with the following parameters:

```yaml
query: "your search query"  # Required - search keywords
count: 5                     # Optional - number of results (1-10)
engine: "bing"              # Optional - bing, baidu, duckduckgo, google
language: "zh"              # Optional - zh, en (for auto-recommendation)
```

### Response Structure

```json
{
  "success": true,
  "query": "search query",
  "engine": "bing",
  "count": 5,
  "results": [
    {
      "rank": 1,
      "title": "Result Title",
      "url": "https://example.com",
      "snippet": "Result description...",
      "source": "example.com"
    }
  ]
}
```

## 📖 Examples

### Basic Search (English)
```yaml
query: "latest AI news 2024"
count: 5
```

### Advanced Search (Chinese)
```yaml
query: "人工智能 最新进展"
count: 10
engine: "baidu"
language: "zh"
```

### Multi-Engine Search
Use `searchMultiple` to search across all engines:
```yaml
query: "Go language best practices"
count: 5
engines: ["bing", "baidu", "duckduckgo", "google"]
```

### Programmatic Usage
```javascript
const { webSearch, search, searchMultiple, formatToMarkdown } = require('./index');

// Simple search
const result = await search({
  query: "OpenCLaw browser automation",
  count: 5,
  engine: "bing"
});

// Format as Markdown
const markdown = formatToMarkdown(result);
console.log(markdown);

// Multi-engine search
const results = await searchMultiple({
  query: "web search without API",
  count: 3,
  engines: ["bing", "duckduckgo"]
});
```

## 🌐 Supported Engines

| Engine | Status | Language | Notes |
|--------|--------|----------|-------|
| Bing | ✅ Primary | English | Best for general searches |
| Baidu | ✅ Primary | Chinese | Best for Chinese content |
| DuckDuckGo | ✅ Supported | Multi | Privacy-focused alternative |
| Google | ⚠️ Limited | Multi | May require CAPTCHA handling |

### Engine Recommendations

| Scenario | Recommended Engine |
|----------|-------------------|
| English queries | Bing (default) |
| Chinese queries | Baidu |
| Privacy focus | DuckDuckGo |
| All engines | Use `searchMultiple` |

## ⚙️ How It Works

This skill integrates with OpenClaw's built-in browser tool:

1. **Query Processing** - Clean and validate search query
2. **Engine Selection** - Choose appropriate search engine
3. **URL Generation** - Build search engine URL
4. **Browser Automation** - Open URL and capture snapshot
5. **Result Parsing** - Extract structured results from DOM
6. **Output Formatting** - Return formatted results

### Search Flow

```
User Request
    ↓
[Validate Query] → Valid?
    ↓ 是          ↓ 否
[Select Engine]  Return Error
    ↓
[Build Search URL]
    ↓
[Browser: Open URL]
    ↓
[Browser: Get Snapshot]
    ↓
[Parse Results]
    ↓
[Return Structured Data]
```

## 🛠️ Error Handling

The skill includes comprehensive error handling:

| Error Type | Handling Strategy |
|------------|-------------------|
| Invalid Query | Returns error with suggestions |
| Unknown Engine | Returns error with valid engine list |
| Empty Results | Returns success with empty array |
| Browser Timeout | Suggests fallback engines |
| DOM Parsing | Uses backup parsing methods |

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "suggestions": "Helpful suggestions",
  "validEngines": ["bing", "baidu", "duckduckgo", "google"]
}
```

## 📊 CLI Usage

```bash
# Basic search
node index.js "search query"

# Advanced options
node index.js "search query" --count 10 --engine bing --language zh

# JSON output
node index.js "search query" --json

# Multi-engine search
node index.js "search query" --multi

# Help
node index.js --help
```

## 🔍 Result Parser

The parser uses multiple strategies:

1. **Primary Parsing** - Uses engine-specific selectors
2. **Backup Parsing** - Generic DOM traversal if primary fails
3. **Result Deduplication** - Removes duplicate results
4. **Field Extraction** - Title, URL, snippet, source

### Parser Functions

| Function | Purpose |
|----------|---------|
| `parseSearchResults` | Main result extraction |
| `filterResults` | Remove invalid results |
| `formatOutput` | Format as structured data |
| `generateSummary` | Create result summaries |

## 📝 Output Formats

### Markdown
```markdown
## 🔍 搜索结果 (Bing)
**搜索关键词**: AI latest news
**结果数量**: 5

### 1. AI News 2024
**URL**: https://example.com
**来源**: example.com
**摘要**: Latest AI developments...
```

### JSON
```json
{
  "success": true,
  "query": "AI latest news",
  "engine": "bing",
  "count": 5,
  "results": [...]
}
```

## 🎯 Best Practices

1. **Use appropriate engine for language**
   - English queries → Bing (default)
   - Chinese queries → Baidu

2. **Adjust count parameter**
   - Start with 3-5 results for quick results
   - Use 10 for comprehensive search

3. **Handle empty results**
   - Check `success` and `results.length`
   - Try alternative engines if needed

4. **Cache results when possible**
   - Search results don't change frequently
   - Consider caching for repeated queries

## 🚨 Known Limitations

1. **CAPTCHA Protection**
   - Google may require CAPTCHA
   - Use Bing or Baidu for reliability
   - Consider rate limiting

2. **DOM Structure Changes**
   - Search engines may update layouts
   - Parser may need updates
   - Check engine changelogs

3. **Language Limitations**
   - Results may be in different language
   - Use `language` parameter to influence
   - Baidu is best for Chinese content

## 📦 Installation

The skill is designed to work within OpenClaw's skill framework:

```
skills/
└── web-search/
    ├── index.js
    ├── engines.js
    ├── parser.js
    ├── SKILL.md
    └── package.json
```

No additional dependencies required!

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- Add more search engines
- Improve parsing reliability
- Add caching layer
- Support search filters
- Add result ranking

## 📄 License

MIT License - Free and open source

---

**No API keys. No limits. Just search.** 🚀
