![npm](https://img.shields.io/npm/v/lime-cli.svg) ![npm](https://img.shields.io/npm/dw/lime-cli.svg?label=lime-cli) ![npm](https://img.shields.io/npm/dw/@limejs/cli.svg?label=%40limejs%2Fcli) ![NPM](https://img.shields.io/npm/l/lime-cli.svg)


lime-cli
======

lime-cli是 [lime.js](https://github.com/limejs/lime) Web开发框架配套的项目管理工具，包含 项目初始化、项目模块创建等能力；同时具有灵活的 `子命令` 开发机制。

## 特性

* 初始化适配各种场景的 lime.js 项目, 快速启动开发.
* 灵活的插件机制，内置配置管理能力；快速开发自定义命令.
* 快捷创建 lime 框架模块，如 controller、model. [`developing`]

## 安装

``` bash
npm install lime-cli -g
# 或
npm install @limejs/cli -g
```

## 使用

lime-cli 默认支持的命令有:

```bash
lime init # 可交互的方式初始化 lime 项目脚手架
lime list # 查询并列出支持的 官方和私有项目模板
lime tpl # 增删私有项目模板
lime doc # 查看 lime-cli 帮助文档
lime config # 修改本地 lime-cli 的配置
lime new [controller|model|view] # 新建 controller 相关文件，*尚未支持*
lime plugin # 管理 lime 项目插件 *尚未支持*
```

### 初始化项目

```bash
lime init my-project
```

其中 `my-project` 表示要把项目创建在哪个 目录 下，可以支持输入 `.` 表示当前所在目录。

执行上述命令，会交互式的选择所使用的 `项目模板`，然后发起模板所要求的交互提示。在完成交互后，项目会在你指定的 `my-project` 下生成所有项目样板文件。之后您可以进入项目目录，进行开发工作。

目前 lime-cli 支持官方提供的 4 个项目模板，如果你需要自己定制也非常简单，参考 [模板制作](./TEMPLATE.md) 指引来开发自己的私有模板。

### cli 本地配置

```bash
lime config set a=1 // 设置配置项a的值为1
```

你可以设置任意自己喜欢的配置，以备自己编写自定义命令插件时使用。当然，lime-cli 自身已经支持了一些可用的配置。

lime-cli 自身支持如下的配置项:

配置名   |   含义|默认值|示例
-----   |  ---  |----|---
self_cmd_dir|放置自定义子命令代码的目录|lime-cmd|"utils/mycmd"
templates_dir|远程模板的缓存目录|~/.lime-cli|"~/.lime"

### 制作私有模板

通常，你可能会形成自己的项目样板。借助 lime-cli，你可以使用自己的样板来初始化项目。步骤如下:

1. 编写项目模板([教程](./TEMPLATE.md))，并托管到 github/bucket 等支持 git 协议的代码仓库平台
2. 通过 `lime tpl add <name> <url>` 命令将自己的私有模板添加到 lime-cli 的模板列表中

```bash
  lime tpl add mytpl myaccount/lime
```

其中 url 字段可以填写 github 的仓库短名称；如果不是 github 上的仓库，可以使用模板的完整的 URI 地址

## 自定义子命令

lime-cli 支持编写自己的子命令，如实现一个 `lime drop` 命令。编写方式非常简单。现在假设你要编写一个 drop 子命令用来删除特定的页面文件，我们以此为例来说明步骤:

* 在当前项目根目录下创建一个目录 `lime-cmd`
* 在 lime-cmd 目录下创建一个子目录叫做 `drop`
* 在drop目录下新建一个 `index.js` 文件
* 按照规范编写子命令代码
* lime-cli 再次执行时，会自动加载当前工作目录(cwd)下的 `lime-cmd` 目录中的子命令

### 编写子命令代码

子命令js代码中只需导出一个 commander 所需的模块即可，对应字段的含义也可以去参考 `commander` 的官方文档。在这里我们简单介绍一下，足够你编写自己所需的命令功能。

```js
const rimrf = require('rimrf)

module.exports = {
    command: "drop",
    description: "删除项目的dist目录",
    help: () => {
        console.log('  例子:');
        console.log('');
        console.log('    $ lime drop');
        console.log();
    },
    options: [
      ['--f', '递归强制删除']
    ],
    action: () => {
        rimrf(path.join(process.cwd(), 'dist'))
        process.exit(0);
    }
};
```

其中

* command 表示子命令名字，格式跟 commander.command() 方法一致；
* description表示命令的描述，可在 `-h` 查看帮助时输出在顶部；
* `help` 会以 commander.on('help') 的方式挂载，可以给当前子命令追加自己喜欢的帮助信息；
* options表示配置选项，会以 commander.options() 的方式挂载，与 commander.options方法形参格式一致，第一个参数表示option指令，第二个参数表示参数描述
* action是commander命中后的回调，在这里可以编写你命令的主要逻辑


## TODO

支持更多类似 thinkjs 的模块添加命令

## Thanks

lime-cli 有参考 vue-cli, zan-node, think-cli, rato 等项目，在此对这些开源项目表示感谢

## License
MIT
