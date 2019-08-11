# 搞懂webpack热更新原理

## 目录

- HMR简单介绍
  - 是什么东西
  - 为什么需要他
  - 有没有更好的方案
- HMR简单使用
  - 如何配置
  - 有什么优势
- 一层层剥开
  - webpack的模块规范
    - 核心实现详解
    - commonjs的require规范实现 - 为自己的博客引流
  - webpack编译流程 - 为自己的博客引流
    - balabala
  - HMR流程图
    

## TODO

- 

## HMR是什么

`HMR`即`Hot Module Replacement`是指当你对代码修改并保存后，`webpack`将会对代码进行重新打包，并将改动的模块发送到浏览器端，浏览器用新的模块替换掉旧的模块，去实现局部更新页面而非整体刷新页面。

### 使用场景

![scenario](./assets/1-scenario.jpg)

如上图所示，一个注册页面包含`用户名`、`密码`、`邮箱`三个必填输入框，以及一个`提交`按钮，当你在调试`邮箱`模块改动了代码时，没做任何处理情况下是会刷新整个页面，频繁的改动代码会浪费你大量时间去重新填写内容。预期是保留`用户名`、`密码`的输入内容，而只替换`邮箱`这一模块。这一诉求就需要借助`webpack-dev-server`的热模块更新功能。

相对于`live reload`整体刷新页面的方案，`HMR`的优点在于可以保存应用的状态，提高开发效率。

## 配置使用HMR

### 配置webpack

- 简单配置

### 解析webpack打包后的文件内容

- webpack自己实现的一套commonjs规范讲解
- 区分commonjs和esmodule

### 配置HMR


## HMR原理

![core](./assets/2-core.jpg)

如上图所示，`Server`端使用`webpack-dev-server`去启动本地服务，内部实现主要使用了`webpack`、`express`、`websocket`。

- 使用`express`启动本地服务，当浏览器访问资源时对此做响应。
- 服务端和客户端使用`websocket`实现长连接
- `webpack`监听源文件的变化，即当开发者保存文件时触发`webpack`的重新编译。
  - 每次编译都会生成一个`hash戳`以及文件
  - 编译完成后通过`socket`向客户端推送当前编译的`hash戳`
- 客户端的`websocket`监听到有文件改动推送过来的`hash戳`，会和上一次对比
  - 一致则走缓存
  - 不一致则通过`ajax`和`jsonp`向服务端获取最新资源
- 使用`内存文件系统`去替换有修改的内容实现局部刷新

## debug服务端源码

debug源码分析其详细思路

1. 启动`webpack-dev-server`服务器，源代码地址[@webpack-dev-server/webpack-dev-server.js#L173](https://github.com/webpack/webpack-dev-server/blob/v3.7.2/bin/webpack-dev-server.js#L173)
1. 创建webpack实例，源代码地址[@webpack-dev-server/webpack-dev-server.js#L89](https://github.com/webpack/webpack-dev-server/blob/v3.7.2/bin/webpack-dev-server.js#L89)
1. 创建Server服务器，源代码地址[@webpack-dev-server/webpack-dev-server.js#L107](https://github.com/webpack/webpack-dev-server/blob/v3.7.2/bin/webpack-dev-server.js#L107)
1. 添加webpack的done事件回调，源代码地址[@webpack-dev-server/Server.js#L122](https://github.com/webpack/webpack-dev-server/blob/v3.7.2/lib/Server.js#L122)
  1. 编译完成向客户端发送消息，源代码地址[@webpack-dev-server/Server.js#L184](https://github.com/webpack/webpack-dev-server/blob/v3.7.2/lib/Server.js#L184)
1. 创建express应用app，源代码地址[@webpack-dev-server/Server.js#L123](https://github.com/webpack/webpack-dev-server/blob/v3.7.2/lib/Server.js#L123)
1. 设置文件系统为内存文件系统，源代码地址[@webpack-dev-middleware/fs.js#L115](https://github.com/webpack/webpack-dev-middleware/blob/v3.7.0/lib/fs.js#L115)
1. 添加webpack-dev-middleware中间件，源代码地址[@webpack-dev-server/Server.js#L125](https://github.com/webpack/webpack-dev-server/blob/v3.7.2/lib/Server.js#L125)
  1. 中间件负责返回生成的文件，源代码地址[@webpack-dev-middleware/middleware.js#L20](https://github.com/webpack/webpack-dev-middleware/blob/v3.7.0/lib/middleware.js#L20)
1. 启动webpack编译，源代码地址[@webpack-dev-middleware/index.js#L51](https://github.com/webpack/webpack-dev-middleware/blob/v3.7.0/index.js#L51)
1. 创建http服务器并启动服务，源代码地址[@webpack-dev-server/Server.js#L135](https://github.com/webpack/webpack-dev-server/blob/v3.7.2/lib/Server.js#L135)
1. 使用sockjs在浏览器端和服务端之间建立一个 websocket 长连接，源代码地址[@webpack-dev-server/Server.js#L745](https://github.com/webpack/webpack-dev-server/blob/v3.7.2/lib/Server.js#L745)
  1. 创建socket服务器，源代码地址[@webpack-dev-server/SockJSServer.js#L34](https://github.com/webpack/webpack-dev-server/blob/v3.7.2/lib/servers/SockJSServer.js#L34)

### 简易实现

上面是我通过debug得出dev-server运行流程比较核心的几个点，下面将其[抽象成一个文件](./dev-server.js)。

#### 启动webpack-dev-server服务器
先导入所有依赖
```js
const path = require('path');
const express = require('express');
const mime = require('mime');
const webpack = require('webpack');
const MemoryFileSystem = require('memory-fs');
const config = require('./webpack.config');
```

#### TODO

### 调试阶段

运行可见
