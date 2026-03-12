# 变更日志

本文件记录 Web Search Skill 的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [Unreleased]

### 计划中的功能

- 🔄 搜索结果缓存机制
- 📊 搜索历史记录
- 🎯 高级搜索语法支持
- 📤 结果导出功能 (JSON/CSV)
- 🔍 图片搜索支持
- 📰 新闻搜索过滤器

---

## [1.0.0] - 2024-03-12

### ✨ 新增功能

#### 核心功能

- 🎉 **首次发布** - Web Search Skill 正式上线
- 🔍 **多引擎支持** - 支持 Bing、Baidu、DuckDuckGo、Google
- 📊 **结构化输出** - 标准化的搜索结果格式
- 🌐 **零 API Key** - 基于浏览器自动化，无需任何 API 密钥

#### 搜索引擎

- ✅ Bing 搜索引擎支持
- ✅ Baidu 搜索引擎支持（中文优化）
- ✅ DuckDuckGo 搜索引擎支持（隐私保护）
- ⚠️ Google 搜索引擎支持（可能触发 CAPTCHA）

#### 参数配置

- `query` - 搜索关键词（必填）
- `count` - 结果数量 (1-10，默认 5)
- `engine` - 搜索引擎选择 (默认 bing)

#### 文档

- 📖 完整的 SKILL.md 技能文档
- 📚 详细的 README.md 项目说明
- 📝 安装指南 INSTALL.md
- 📋 变更日志 CHANGELOG.md
- 💡 6 个使用示例文件

---

## 版本说明

### 版本号规则

- **主版本号 (Major)**: 不兼容的 API 变更
- **次版本号 (Minor)**: 向后兼容的功能新增
- **修订号 (Patch)**: 向后兼容的问题修复

### 变更类型

| 图标 | 类型 | 说明 |
|------|------|------|
| ✨ | 新增 | 新功能 |
| 🔧 | 变更 | 对现有功能的变更 |
| 🐛 | 修复 | Bug 修复 |
| 🗑️ | 移除 | 已移除的功能 |
| 🔒 | 安全 | 安全相关修复 |
| 📖 | 文档 | 文档更新 |

---

## 路线图

### v1.1.0 (计划)

- [ ] 搜索结果缓存
- [ ] 搜索历史记录
- [ ] 高级搜索语法

### v1.2.0 (计划)

- [ ] 图片搜索
- [ ] 新闻搜索过滤器
- [ ] 结果导出功能

### v2.0.0 (未来)

- [ ] AI 智能搜索建议
- [ ] 搜索结果质量评分
- [ ] 自定义搜索引擎配置

---

## 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 代码规范

- 使用 ESLint 进行代码检查
- 编写清晰的注释
- 更新相关文档
- 添加测试用例

---

## 致谢

感谢以下项目和技术的支持：

- [OpenClaw](https://openclaw.dev) - 强大的 AI Agent 框架
- [Playwright](https://playwright.dev) - 浏览器自动化工具
- 所有贡献者和用户

---

_本变更日志会持续更新，记录每个版本的变更。_