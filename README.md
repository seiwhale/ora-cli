# ora-cli 

A simple CLI for scaffolding ora projects.

### Installation

Prerequisites: [Node.js](https://nodejs.org/en/) (>=6.x, 8.x preferred), npm version 3+ and [Git](https://git-scm.com/).

``` bash
$ npm install -g ora-cli
```

### Usage

``` bash
$ ora init [template-name] <project-name>
# or
# then you should select one template from office template list
$ ora init <project-name>
```

Example:

``` bash
$ ora init my-project
```

The above command pulls the template from [ora-templates/default](https://github.com/ora-templates/default), prompts for some information, and generates the project at `./my-project/`.