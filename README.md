lime-cli
======

lime-cli是 lime(青檬) Web开发框架配套的项目管理工具，包含 项目初始化、项目模块创建等能力；同时具有灵活的 `子命令` 开发机制。

## 特性

* 初始化 lime 项目
* 新建 lime模块，如 controller、model
* 初始化子命令开发模板
* 修改 lime-cli 的默认配置
* Git 风格的子命令使用方式

## TODO

支持更多类似 thinkjs 的模块添加命令

## 安装

``` bash
npm install lime-cli -g
```

## 使用

### 初始化项目

```bash
lime init my-project
```

执行上述命令，会在当前目录创建一个名为 my-project 的基于 lime web开发框架的项目，并自动进行项目依赖安装。之后您可以进入项目目录，进行开发工作。

lime-cli 支持一系列

```bash
lime doc
```

## 配置 lime-cli

```bash
lime config --set a=1 // 设置配置项a的值为1
```

你可以设置任意自己喜欢的配置，以备自己编写自定义命令使用。当然，lime-cli 自身已经支持了一些可用的配置。

### 配置项

配置名   |   含义|默认值|示例
-----   |  ---  |----|---
self_cmd_dir|放置自定义子命令代码的目录|lime-cmd|"utils/mycmd"



## 编写子命令

lime-cli 支持编写自己的子命令，如实现一个 `lime drop` 命令。编写方式非常简单。现在假设你要编写一个 drop 子命令用来删除特定的页面文件，我们以此为例来说明步骤:

* 在当前项目根目录下创建一个目录 `lime-cmd`
* 在 lime-cmd 目录下创建一个子目录叫做 `drop`
* 在drop目录下新建一个 `index.js` 文件
* 编写命令代码
* lime-cli 再次执行时，会自动加载当前运行目录(cwd)下的lime-cmd下的子命令

### 编写子命令代码

子命令js代码中只需导出一个 commander 所需的模块即可，对应字段的含义也可以去参考 commander 的官方文档。在这里我们简单介绍一下，足够你编写自己所需的命令功能。

```js
module.exports = {
    command: "doc",
    description: "查看 ZanNode 框架文档",
    help: () => {
        console.log('  Examples:');
        console.log('');
        console.log('    $ zan doc');
        console.log();
    },
    options: [
      ['--api', '打开api文档']
    ],
    action: () => {
        opn('https://www.youzanyun.com/zan-node');
        process.exit(0);
    }
};
```

其中

* command 表示子命令名字，格式跟 commander.command() 方法一致；
* description表示命令的描述，可在 `-h` 查看帮助时展示； 
* `help` 会以 commander.on('help') 的方式挂载，可以给当前子命令追加自己喜欢的帮助信息；
* options表示配置选项，会以 commander.options() 的方式挂载，与 commander.options方法形参格式一致，第一个参数表示option指令，第二个参数表示参数描述
* action是commander命中后的回调

## Thanks

lime-cli 有参考 vue-cli, zan-node, think-cli, rato 等项目，在此对这些开源项目表示感谢

## License
MIT
