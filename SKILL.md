---
name: web-search
description: Web search skill using browser automation - no API key required. Use when you need to search the web for current information, research topics, or find specific content.
metadata:
  openclaw:
    requires:
      bins: []
---

# Web Search Skill

A free web search skill that uses browser automation - no API key required!

## Features

- 🔍 **No API Key Required** - Uses browser automation
- 🌐 **Multi-Engine Support** - Bing, DuckDuckGo, Google
- 📊 **Structured Results** - Returns title, URL, snippet
- 🔄 **Fallback Support** - Auto-switches between engines

## When to Use

- Searching for current information
- Research on any topic
- Finding specific websites or content
- Getting latest news and updates

## Usage

The skill provides the `web_search` function with the following parameters:

```yaml
query: "your search query"
count: 5          # number of results (1-10)
engine: "bing"    # bing, duckduckgo, or auto
```

## Examples

### Basic Search
```yaml
query: "latest AI news 2024"
count: 5
```

### Technical Search
```yaml
query: "Go language best practices"
count: 10
engine: "duckduckgo"
```

## Implementation

This skill uses browser automation to perform searches without requiring external API keys:

1. Opens search engine in headless browser
2. Parses search results
3. Returns structured data

## Supported Engines

| Engine | Status | Notes |
|--------|--------|-------|
| Bing | ✅ Primary | Best for general searches |
| DuckDuckGo | ✅ Fallback | Privacy-focused alternative |
| Google | ⚠️ Limited | May require CAPTCHA handling |

## Notes

- Rate limiting: Be respectful, avoid rapid repeated searches
- CAPTCHA: Some engines may trigger CAPTCHA for automated access
- Accuracy: Results match what you'd see in a regular browser

---

_Free and open source. No API keys, no limits._