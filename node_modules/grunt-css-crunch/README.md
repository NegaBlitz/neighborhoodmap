# grunt-css-crunch

> Crunches, optimizes and resolves/copies assets of css files

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-css-crunch --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-css-crunch');
```

## The "css_crunch" task

### Overview
css-crunch is a multi-task. You specify one or multiple targets, with their options. Options are passed as-is to [css-crunch](https://npmjs.org/package/css-crunch).

```js
grunt.initConfig({
  css_crunch: {
    target1: {
        src: "...\\css",
        dest: "...\\css\\build\\test.min.css",
        exclude: ["*min.css"],
        reporter: 'html|console',
        minify: true,
        optimize: true,
        copy: true
    },
    target2: {
      // css-crunch options...
    },
  },
})
```

## Release History
0.1.0 - 12/11/2013 - Initial commit