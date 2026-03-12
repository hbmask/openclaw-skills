# 🚀 快速开始指南

> 5 分钟快速上手 Web Search Skill

---

## 📦 安装 (1 分钟)

```bash
# 安装技能
npx openclaw skills add web-search

# 验证安装
npx openclaw skills list
```

---

## 🔍 基础搜索 (1 分钟)

### 最简单的搜索

```yaml
query: "人工智能"
```

就这么简单！默认使用 Bing 引擎，返回 5 条结果。

### 中文内容搜索

```yaml
query: "Go语言教程"
engine: "baidu"
```

使用 Baidu 引擎获得更好的中文内容。

---

## 🎯 常用场景 (3 分钟)

### 场景 1：技术文档查找

```yaml
query: "React Hooks 最佳实践"
engine: "bing"
count: 10
```

### 场景 2：新闻资讯获取

```yaml
query: "AI 最新进展 2024"
engine: "bing"
count: 5
```

### 场景 3：中文资源搜索

```yaml
query: "企业微信 API 开发"
engine: "baidu"
count: 8
```

### 场景 4：隐私保护搜索

```yaml
query: "privacy tools comparison"
engine: "duckduckgo"
count: 5
```

---

## 📊 返回结果格式

```json
[
  {
    "rank": 1,
    "title": "React 官方文档",
    "url": "https://react.dev/...",
    "snippet": "React 是一个用于构建用户界面的 JavaScript 库...",
    "source": "react.dev"
  }
]
```

---

## ⚙️ 参数速查表

| 参数 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `query` | ✅ | - | 搜索关键词 |
| `count` | ❌ | 5 | 结果数量 (1-10) |
| `engine` | ❌ | bing | 搜索引擎 |

### 引擎选择

| 引擎 | 值 | 推荐场景 |
|------|-----|----------|
| Bing | `bing` | 英文内容，默认选择 |
| Baidu | `baidu` | 中文内容 |
| DuckDuckGo | `duckduckgo` | 隐私保护 |
| Google | `google` | 技术搜索 (⚠️ 可能触发验证码) |

---

## 🎓 进阶技巧

### 技巧 1：优化搜索词

```yaml
# ❌ 太宽泛
query: "AI"

# ✅ 具体
query: "OpenAI GPT-4 API 定价 2024"
```

### 技巧 2：组合搜索

```yaml
# 先搜中文资源
query: "Kubernetes 入门教程"
engine: "baidu"
count: 5

# 再搜英文资源
query: "Kubernetes best practices"
engine: "bing"
count: 5
```

### 技巧 3：结果数量控制

```yaml
# 快速查找 - 少量结果
query: "Python 官网"
count: 3

# 深度调研 - 更多结果
query: "微服务架构设计模式"
count: 10
```

---

## 📚 更多资源

- 📖 [完整文档](SKILL.md)
- 📦 [安装指南](INSTALL.md)
- 📝 [变更日志](CHANGELOG.md)
- 💡 [使用示例](examples/)

---

## ❓ 常见问题

### Q: 为什么搜索结果为空？

**A:** 尝试更换搜索引擎，或简化搜索关键词。

### Q: 如何搜索中文内容？

**A:** 使用 `engine: "baidu"` 参数。

### Q: 搜索速度慢怎么办？

**A:** 减少 `count` 参数值，或检查网络连接。

---

## 🆘 获取帮助

遇到问题？

1. 查看 [故障排除](SKILL.md#故障排除)
2. 阅读 [安装指南](INSTALL.md)
3. 提交 [Issue](https://github.com/hbmask/openclaw-skills/issues)

---

**🎉 开始你的搜索之旅吧！**