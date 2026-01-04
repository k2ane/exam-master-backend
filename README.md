# Exam-Master-Backend

![License](https://img.shields.io/badge/license-Apache_2.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-v18.0+-green.svg)
![npm](https://img.shields.io/badge/npm-v10.0+-red.svg)  
基于 express 的在线答题系统后端，提供题库管理，用户登录注册，随机出题，顺序答题，模拟考试，收藏，标记，统计分析等多种功能

## Devlopment RoadMap

完成功能会使用 ✅ 标记

- 🤵 **用户模块**
  - - [ ] 用户登录, 注册, 登出, 注销（`login` - `register` - `logout` - `account_closure`）
  - - [ ] 部门管理, 新增, 删除
  - - [ ] 权限管理（超级管理员(`admin`), 部门主管(`manager`), 职员(`member`)）
- 🗃️ **题库模块**
  - - [ ] 题库创建，删除，修改，查询
  - - [ ] 题库分类（视频题，图片题，文件题，文字题）

## ▶️ 使用

**克隆仓库**

```bash
git clone https://github.com/k2ane/exam-master-backend.git
cd exam-master-backend
```

**安装依赖, 启动应用**

```bash
npm i && npm run dev
```

## 📂 文件夹结构

- 📂 api
  - 📂 v1 - 目前版本 api
    - 📂 auth - 认证类路由
      - 📂 login - 登录事件处理 （`🔔无须中间件鉴权`）
        - 📄 index.ts - （`{host}/api/v1/auth/login`）
      - 📂 register- 注册事件处理 （`🔔无须中间件鉴权`）
        - 📄 index.ts - （`{host}/api/v1/auth/register`）
      - 📂 logout - 登出事件处理 （`🚨须中间件鉴权`）
        - 📄 index.ts - （`{host}/api/v1/auth/logout`）
      - 📂 account_closure - 销户事件处理 （`🚨须中间件鉴权`）
        - 📄 index.ts - （`{host}/api/v1/auth/account_closure`）
      - 📄 auth_route.ts 认证类路由汇总
    - 📂 users - 用户类路由 （`🚨须中间件鉴权`）
    - 📂 questionBank - 题库类路由 （`🚨须中间件鉴权`）
    - 📄 route.ts - 路由汇总
- 📂 middleware - 路由中间件
  - 📄 authentication.ts 处理 token 认证中间件
- 📂 utils - 操作工具
  - 📂 auth - 认证操作
  - 📂 database - 数据库操作
- 📄 .env - 环境配置文件
- 📄 package.json - 依赖
- 📄 tsconfig.json - TypeScript 配置文件

## ⭐ 功能特性
