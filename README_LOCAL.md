# 屏蔽操作说明

1. 屏蔽“AI极速编码”：注释\my-cool-admin-vue\src\modules\helper\config.ts
2. 屏蔽“GitHub”: 注释\my-cool-admin-vue\src\plugins\github\config.ts
3. 屏蔽COOL首页dome：\my-cool-admin-vue\src\modules\demo\views\home\index.vue，以及其components

# 修改菜单栏上的logo

1. LOGO：\my-cool-admin-vue\src\modules\base\pages\main\components\slider.vue 注释掉的img
2. 名称：\my-cool-admin-vue\.env

# 菜单栏背景色

1. 左侧菜单栏背景色：src\modules\base\pages\main\components\slider.vue 主题色配置--var(--el-color-primary)

# 首页横向菜单栏

1. 路径：\my-cool-admin-vue\src\modules\base\pages\main\components\topbar.vue 添加横向滚动条

# 原生打包

1. 前端打包：在前端项目目录下执行 npm run build-static 打包完成后，将生成的 dist 目录下的内容复制到后端项目的 public 目录下
2. 后端打包：在后端项目目录下执行 npm run pkg 打包后的文件将生成在 build 目录下。
3. 配置说明：在 package.json 中，通过 pkg 字段配置打包参数：
   {
   "pkg": {
   "scripts": [
   "dist/**/*", // 需要打包的源码文件
   "node_modules/axios/dist/node/*" // 需要打包的依赖
   ],
   "assets": [
   "public/**/*", // 静态资源文件
   "typings/**/*" // 类型定义文件
   ],
   "targets": [
   "node20-macos-x64" // 目标平台
   ],
   "outputPath": "build" // 输出目录
   }
   }
   配置说明
   scripts: 指定需要打包的源码文件和依赖
   assets: 指定需要打包的静态资源文件
   targets: 指定打包的目标平台，支持：
   node20-macos-x64: MacOS x64 架构
   node20-macos-arm64: MacOS arm64 架构 M1、M2 等芯片
   node20-linux-x64: Linux x64 架构
   node20-win-x64: Windows x64 架构
   ...
   outputPath: 指定打包后的输出目录
4. 如果二次打包未成功，尝试删除自动生成的\my-cool-admin-midway\src\index.ts和\my-cool-admin-midway\src\entities.ts

# linux部署

1. 进入目录停止服务
   cd ../回退进入usr/local/swl目录
   ./serve.sh stop
   //查看进程
   ps -ef | grep swl-admin

    //杀掉进程
    Kill 2594897

2. 上传前后端文件
   备份：/usr/local/swl
   备份：/etc/nginx/html/swl
   赋予权限：chmod 777 cool-admin-linux

3. 启动服务
   ./serve.sh start

4. 重启服务
   ./serve.sh restart

5. 重启nginx服务
   目录：usr/sbin
   ./nginx -s reload

# Ubuntu下安装Nginx

1.sudo apt-get update
2.sudo apt-get install nginx

# Ubuntu下卸载Nginx

1.sudo apt-get remove nginx nginx-common # 卸载删除了配置文件以外的所有文件。
2.sudo apt-get purge nginx nginx-common # 卸载所有东东，包括删除配置文件。
3.sudo apt-get autoremove # 在上面命令结束后执行，主要是卸载删除Nginx的不再被使用的依赖包
4.sudo apt-get remove nginx-full nignx-common # 卸载删除两个主要的包。
