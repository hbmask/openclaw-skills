# Web Search Skill

A free web search skill for OpenClaw - **no API key required!**

## Features

- 🔍 **No API Key Required** - Uses browser automation
- 🌐 **Multi-Engine Support** - Bing, Baidu, DuckDuckGo, Google
- 📊 **Structured Results** - Returns title, URL, snippet, source
- 🔄 **Smart Engine Selection** - Auto-recommend based on language
- 🇨🇳 **Chinese Support** - Baidu for Chinese content

## Installation

Place the `web-search` folder in your OpenClaw skills directory:

```
skills/
└── web-search/
    ├── index.js
    ├── engines.js
    ├── parser.js
    ├── SKILL.md
    └── package.json
```

## Usage

```javascript
const { webSearch, search, formatToMarkdown } = require('./skills/web-search');

// Simple search
const result = await search({
  query: "latest AI news 2024",
  count: 5,
  engine: "bing"
});

// Format as Markdown
console.log(formatToMarkdown(result));
```

## Search Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| query | string | Yes | - | Search keywords |
| count | number | No | 5 | Number of results (1-10) |
| engine | string | No | bing | Search engine: bing, baidu, duckduckgo, google |
| language | string | No | auto | Language: zh, en |

## Supported Search Engines

| Engine | Language | Status |
|--------|----------|--------|
| Bing | English | ✅ Primary |
| Baidu | Chinese | ✅ Primary |
| DuckDuckGo | Multi | ✅ Supported |
| Google | Multi | ⚠️ May require CAPTCHA |

## Testing

```bash
cd skills/web-search
node test.js
```

## License

MIT License
