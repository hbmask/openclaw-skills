# 安装指南

本文档提供详细的安装步骤和配置说明。

---

## 📋 系统要求

### 必需环境

| 软件 | 版本要求 | 说明 |
|------|----------|------|
| **OpenClaw** | >= 1.0.0 | OpenClaw 核心框架 |
| **Node.js** | >= 18.0.0 | JavaScript 运行时 |
| **浏览器** | - | 需要支持的浏览器 (Chromium/Firefox/WebKit) |

### 可选环境

| 软件 | 用途 |
|------|------|
| **Git** | 从源码安装 |
| **npm/yarn** | 包管理 |

---

## 🚀 安装方式

### 方式一：OpenClaw CLI 安装 (推荐)

最简单快捷的安装方式。

```bash
# 方法 1：直接安装
npx openclaw skills add web-search

# 方法 2：从 ClawHub 安装
npx openclaw skills install web-search

# 验证安装
npx openclaw skills list
```

### 方式二：手动安装

适合需要自定义修改的场景。

#### 步骤 1：下载源码

```bash
# 方法 1：Git 克隆
git clone https://github.com/hbmask/openclaw-skills.git
cd openclaw-skills/web-search

# 方法 2：直接下载 ZIP
# 访问 https://github.com/hbmask/openclaw-skills
# 下载并解压，进入 web-search 目录
```

#### 步骤 2：安装到 OpenClaw

```bash
# Linux/macOS
cp -r . ~/.openclaw/skills/web-search/

# Windows (PowerShell)
Copy-Item -Recurse -Force . "$env:USERPROFILE\.openclaw\skills\web-search\"

# Windows (CMD)
xcopy /E /I /Y . "%USERPROFILE%\.openclaw\skills\web-search\"
```

#### 步骤 3：验证安装

```bash
# 检查技能是否加载
npx openclaw skills list | grep web-search
```

### 方式三：NPM 包安装 (即将支持)

```bash
# 安装为 npm 包
npm install @openclaw/skill-web-search

# 或使用 yarn
yarn add @openclaw/skill-web-search
```

---

## ⚙️ 配置说明

### 技能配置文件

技能配置在 `SKILL.md` 的 frontmatter 中定义：

```yaml
---
name: web-search
description: Web search skill using browser automation...
metadata:
  openclaw:
    requires:
      bins: []
---
```

### 自定义配置

可以在 OpenClaw 配置文件中添加自定义设置：

```yaml
# ~/.openclaw/config.yaml
skills:
  web-search:
    default_engine: bing
    default_count: 5
    timeout: 30000
```

---

## 🔍 验证安装

### 测试搜索功能

安装完成后，在 OpenClaw 中测试：

```yaml
# 基础测试
query: "test search"

# 中文搜索测试
query: "测试搜索"
engine: "baidu"

# 多结果测试
query: "OpenAI"
count: 10
```

### 检查日志

```bash
# 查看 OpenClaw 日志
npx openclaw logs

# 或查看日志文件
tail -f ~/.openclaw/logs/openclaw.log
```

---

## 🐛 故障排除

### 问题 1：技能未加载

**症状**: `web-search` 不在技能列表中

**解决方案**:
```bash
# 检查技能目录
ls ~/.openclaw/skills/web-search/

# 应该看到以下文件
# SKILL.md  README.md  index.js  cli.js  package.json

# 检查文件权限
chmod +x ~/.openclaw/skills/web-search/cli.js
```

### 问题 2：浏览器启动失败

**症状**: 搜索时报浏览器相关错误

**解决方案**:
```bash
# 检查浏览器驱动
npx playwright install

# 或指定浏览器
npx playwright install chromium
```

### 问题 3：网络连接问题

**症状**: 无法访问搜索引擎

**解决方案**:
```bash
# 检查网络连接
ping www.bing.com

# 如在国内，Baidu 引擎更稳定
# engine: "baidu"
```

### 问题 4：搜索结果为空

**症状**: 返回空结果数组

**解决方案**:
- 检查搜索关键词是否正确
- 尝试不同的搜索引擎
- 检查网络连接
- 查看日志获取详细错误信息

---

## 📦 目录结构

安装完成后的目录结构：

```
~/.openclaw/skills/web-search/
├── SKILL.md              # 技能定义文件
├── README.md             # 项目说明
├── INSTALL.md            # 安装指南 (本文件)
├── CHANGELOG.md          # 变更日志
├── index.js              # 主模块
├── cli.js                # CLI 工具
├── package.json          # 项目配置
└── examples/             # 使用示例
    ├── README.md
    ├── basic-search.yaml
    ├── chinese-content.yaml
    ├── technical-docs.yaml
    ├── news-search.yaml
    ├── privacy-search.yaml
    └── multi-engine.yaml
```

---

## 🔄 更新技能

### 更新到最新版本

```bash
# 方式 1：使用 OpenClaw CLI
npx openclaw skills update web-search

# 方式 2：手动更新
cd /path/to/openclaw-skills
git pull
cp -r web-search ~/.openclaw/skills/
```

### 检查当前版本

```bash
# 查看版本信息
cat ~/.openclaw/skills/web-search/package.json | grep version
```

---

## 🗑️ 卸载技能

```bash
# 方式 1：使用 OpenClaw CLI
npx openclaw skills remove web-search

# 方式 2：手动删除
rm -rf ~/.openclaw/skills/web-search
```

---

## 📞 获取帮助

如果遇到问题：

1. 查看 [故障排除](#故障排除) 章节
2. 阅读项目 [README.md](README.md)
3. 查看 [问题列表](https://github.com/hbmask/openclaw-skills/issues)
4. 提交新的 [Issue](https://github.com/hbmask/openclaw-skills/issues/new)

---

## 📝 安装检查清单

安装完成后，确认以下项目：

- [ ] OpenClaw 已正确安装
- [ ] 技能目录存在 `~/.openclaw/skills/web-search/`
- [ ] `SKILL.md` 文件存在且格式正确
- [ ] 测试搜索功能正常工作
- [ ] 中英文搜索均可用
- [ ] 多个搜索引擎可用

---

_如有任何安装问题，欢迎提交 Issue！_