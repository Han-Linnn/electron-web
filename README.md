## 项目结构

```ssh
.
|-- build
|   |-- icon.icns                         # 打包后程序图标 MacOS
|   |-- icon.ico                          # 打包后程序图标 Windows
|   |-- webpack.base.config.js            # electron-webpack 基础配置
|   |-- webpack.main.config.js            # electron-webpack 开发配置
|   `-- webpack.main.prod.config.js       # electron-webpack 正式配置
|-- config
|   `-- config.js                         # umijs配置
|-- main
|   `-- main.js                           # 主程序入口
|-- dist                                  # 项目编译输出目录
|   |-- main                              # 主程序编译目录
|   `-- renderer                          # 页面编译目录
|-- mock                                  # 本地模拟数据
|-- public                                # 静态资源目录
|   `-- renderer.js                       # 如果需要引用node的api，需要在这个js里面提前引入
|-- release                               # 打包输出目录
|-- src                                   # 开发目录
│   |-- assets                            # 本地静态资源
│   |-- components                        # 业务通用组件
│   |-- e2e                               # 集成测试用例
│   |-- layouts                           # 通用布局
│   |-- models                            # 全局 dva model
│   |-- pages                             # 业务页面入口和常用模板
│   |-- services                          # 后台接口服务
│   |-- utils                             # 工具库
│   |-- locales                           # 国际化资源
│   |-- global.less                       # 全局样式
│   `-- global.ts                         # 全局 JS
|-- tests                                 # 测试工具
|-- package.json                          # 项目依赖以及打包配置
`-- README.md                             # 项目说明文档
```

## 环境搭建

### 安装

然后通过 yarn 下载依赖

```javascript
  $ yarn
```

### 开发

通过以下命令启动网页端(默认端口：8080)

```javascript
  $ yarn start:dev
```

通过以下命令启动桌面端(注:要先启动网页端)

```javascript
  $ yarn start:main
```

### 打包

```javascript
  $ yarn build            // 打包win桌面应用
  $ yarn build:renderer   // 打包web版本
```
