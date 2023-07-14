# any-note-book

### 图片压缩问题

本地压缩使用 images 这个库，mac M1 芯片需要升级到 ^3.2.4 版本可以编译，如果编译失败则锁定为 3.2.3 版本。

### m1 芯片 mac 打包问题

报错问题需要升级 builder 比较麻烦，可以使用以下方法解决，安装依赖必须使用 yarn 或 npm（推荐 yarn），不可用 pnpm

#### 替换路径

打开项目中的 `/node_modules/dmg-builder/out/dmg.js` 文件，找到 `/usr/bin/python` 替换为你的本机 python 路径（获取命令：`which python`）

#### 安装 python2

```
brew install pyenv
pyenv install 2.7.18
export PATH="$(pyenv root)/shims:${PATH}"
pyenv global 2.7.18
python --version
```

### electron 配置参考（一般可以不用）

npm config set electron_mirror “https://npm.taobao.org/mirrors/electron/”
npm config set ELECTRON_MIRROR "https://npmmirror.com/mirrors/electron/"
npm config set ELECTRON_BUILDER_BINARIES_MIRROR "https://mirrors.huaweicloud.com/electron-builder-binaries/"

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn electron:serve
```

### Compiles and minifies for production

```
yarn electron:build
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
