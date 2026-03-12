# Web Search Skill 使用示例

本目录包含各种使用场景的示例代码。

## 示例列表

| 文件 | 描述 | 适用场景 |
|------|------|----------|
| `basic-search.yaml` | 基础搜索示例 | 快速上手 |
| `chinese-content.yaml` | 中文内容搜索 | 中文资源 |
| `technical-docs.yaml` | 技术文档搜索 | 开发者 |
| `news-search.yaml` | 新闻资讯搜索 | 资讯获取 |
| `privacy-search.yaml` | 隐私保护搜索 | 敏感内容 |
| `multi-engine.yaml` | 多引擎组合搜索 | 深度调研 |

## 快速开始

1. 选择适合你场景的示例文件
2. 根据需要修改参数
3. 在 OpenClaw 中使用

## 参数速查

```yaml
query: "你的搜索关键词"  # 必填
count: 5                # 可选，结果数量 (1-10)
engine: "bing"          # 可选，搜索引擎
```