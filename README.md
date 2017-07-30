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

* To find your favourite scaffoding template or github repo, eg. felib-template 

* Install the template with lime-cli
``` bash
lime new template-name project-name
```

the template-name is the repository name on github.com, and the project-name is your project name which you want.
When you execute the `lime new` command, lime-cli will download the template and init your project.

If you want to know the detail to use the template, eg. felib-template, please access the template's website.

And now, enjoy your project!



## Official Templates
* html-template, a simple html5 html template
* [html5app-template](https://github.com/cuiyongjian/html5app-template), a html5 template with webpack bundle
* [felib-template](https://github.com/cuiyongjian/felib-template), a front end library template
* node-cmd-template, a node.js commandline programe template
* vue-template, a vue.js 2.0 template
* vue-component-template, a startup template for a `Vue Components Library` project
* lime-cms-template, generate a website driven by lime-cms

when you create project by official templates, you need not use github account name, for example, just use felib-template. But if you use custom templates on github, you need supply your account and repo, like `cuiyongjian/felib-template`

## License
MIT
