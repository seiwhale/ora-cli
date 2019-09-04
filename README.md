# ora-cli [![Build status](https://ci.appveyor.com/api/projects/status/sgpje2o50ef2pgic?svg=true)](https://ci.appveyor.com/project/LishiJ/ora-cli)

A simple scaffolding for creating ora projects.

## Installation

Prerequisites: [Node.js](https://nodejs.org/en/) (>=6.x, 8.x preferred), npm version 3+ and [Git](https://git-scm.com/).

``` bash
$ npm install ora-cli -g
```

## Usage

``` bash
# Get ora help
$ ora / ora -h / ora --help
# List templates
$ ora list
# New project
$ ora init [template-name] <project-name>
```

Example:

``` bash
$ ora init project-name
# Or
$ ora init username/repo project-name
```

The above command pulls the template from [ora-templates](https://github.com/ora-templates), prompts for some information, and generates the project at `./my-project/`.