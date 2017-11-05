lime-cli
======
A Simple CLI for scaffolding any project templates

## Feature
* Adapt to all github repo template
* Lots of official high-quality templates
* Not only frontend, but also more

## Usage
* Install the lime-cli
``` bash
npm install lime-cli -g
```

* To find your favourite scaffoding template, official templates is here:

  * felib-template
  * nodelib-template
  * nodebin-template
  * html5app-template
  * vue-template

* Install the template with lime-cli
``` bash
lime new template-name project-name
```

the template-name is the repository name on github.com, and the project-name is your project name which you want.
When you execute the `lime new` command, lime-cli will download the template and init your project.

If you want to know the detail to use the template, eg. felib-template, please access the template's website.


* if you want to alias a 

And now, enjoy your project!



## Official Templates Introduction
* [html-template](https://github.com/cuiyongjian/html-template), a simple html5 html template
* [html5app-template](https://github.com/cuiyongjian/html5app-template), a html5 template with webpack bundle
* [felib-template](https://github.com/cuiyongjian/felib-template), a front end library template
* [nodebin-template](https://github.com/cuiyongjian/nodebin-template), a node.js commandline programme template
* vue-template, a vue.js 2.0 template
* vue-component-template, a startup template for a `Vue Components Library` project
* limelog-template, generate a blog website driven by limelog

## Thanks
This project is inspired by zan-tool, thanks for youzan Inc.

when you create project by official templates, you need not use github account name, for example, just use felib-template. But if you use custom templates on github, you need supply your account and repo, like `cuiyongjian/felib-template`

## License
MIT
