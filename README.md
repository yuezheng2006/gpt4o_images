# GPT-4o 图片导航站

![GPT-4o Images Gallery](https://raw.githubusercontent.com/jamez-bondos/awesome-gpt4o-images/main/examples/example_happy_capsule.png)

## 项目简介

这是一个展示 OpenAI 最新多模态模型 GPT-4o 生成的精彩图片案例的导航站。用户可以浏览所有图片，查看详细的提示词，并支持一键复制提示词。

## 功能特点

- 📸 展示 46 个 GPT-4o 生成的精彩图片案例
- 💬 悬停时显示提示词并支持一键复制
- 🔍 点击图片查看详情，了解更多信息
- 🌙 支持深色/浅色模式
- 📱 响应式设计，完美适配 PC 和移动端
- 🔐 支持 Google 账号登录
- ✨ 优化的UI体验，包括卡片悬停效果和提示词复制功能

## 在线预览

- [GPT-4o 图片导航站](https://gpto-images-website-sjtvw658.devinapps.com)

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 技术栈

- React + TypeScript
- Vite
- Tailwind CSS (纯Tailwind实现的UI组件)
- shadcn/ui
- Google Identity Services
- Cloudflare Pages (部署)
- Cloudflare Functions (图片代理)

## 数据来源

数据来源于 [jamez-bondos/awesome-gpt4o-images](https://github.com/jamez-bondos/awesome-gpt4o-images) 仓库，包含了 46 个 GPT-4o 生成的精彩图片案例。

## 作者

- [Vincent Yang](https://github.com/yuezheng2006)

## 最近更新

- **2025-04-22**: UI优化 - 完善卡片悬停效果，确保提示词覆盖层完全覆盖卡片；优化提示词复制按钮位置，避免遮挡内容；重构为纯Tailwind CSS实现，提高代码可维护性。
