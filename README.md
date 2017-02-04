![travis badge](https://travis-ci.org/ihmeuw/ihme-ui.svg) [![codecov.io](https://codecov.io/github/ihmeuw/ihme-ui/coverage.svg?branch=master)](https://codecov.io/github/ihmeuw/ihme-ui?branch=master)

# [IHME-UI](https://github.com/ihmeuw/ihme-ui)

ihme-ui is a collection of JavaScript utilities and React-based user interface elements and visualization components developed by the [Institute of Health Metrics and Evaluation](http://healthdata.org). 
This collection is used in IHME's [visualizations of global health metrics](http://www.healthdata.org/results/data-visualizations).

* [Installation](#installation)
* [API Reference](#api)
  * [\<Axis /\>](#axis-)
    * [\<XAxis /\>](#xaxis-)
    * [\<YAxis /\>](#yaxis-)
  * [\<AxisChart /\>](#axischart-)
  * [\<Button /\>](#button-)
  * [\<Choropleth /\>](#choropleth-)
  * [\<ChoroplethLegend /\>](#choroplethlegend-)
  * [\<ExpansionContainer /\>](#expansioncontainer-)
  * [\<Group /\>](#group-)
    * [\<Option /\>](#option-)
  * [\<HtmlLabel /\>](#htmllabel-)
  * [\<Legend /\>](#legend-)
  * [\<MultiSelect /\> and \<SingleSelect /\>](#multiselect--and-singleselect-)
  * [\<ResponsiveContainer /\>](#responsivecontainer-)
  * [\<Shape /\>](#shape-)
    * [\<Area /\>](#area-)
    * [\<Line /\>](#line-)
    * [\<MultiLine /\>](#multiline-)
    * [\<Scatter /\>](#scatter-)
    * [\<Symbol /\>](#symbol-)
  * [\<Slider /\>](#slider-)
  * [\<Spinner /\>](#spinner-)
  * [\<SvgText /\>](#svgtext-)
* [Test Utilities](#test-utilities)
  * [Data Generator](#data-generator)
* [Code Quality](#code-quality)

###### WORK IN PROGRESS: Not stable until v1.0.0

---

## Installation

```sh
npm install -S ihme-ui
```

## Getting started

In it's most simple form, this library can be included in a `<script />` tag and accessed off of `window` as `ihmeUI`.
If you've installed the library from the [npm registry](https://www.npmjs.com/package/ihme-ui), you can pull the library out of your `node_modules` folder. 
If not, grab it off of the unoffical NPM CDN, [unpkg](https://unpkg.com/#/). 
```html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>IHME-UI Starter</title>
  <link rel="stylesheet" href="node_modules/ihme-ui/dist/ihme-ui.min.css"/>
  <!-- OR from unkpk CDN
  <link rel="stylesheet" href="//unpkg.com/ihme-ui/dist/ihme-ui.min.css">
  -->
</head>
<body>
  <main id="app">...</main>
  <script src="node_modules/ihme-ui/dist/ihme-ui.min.js"></script>
  <!-- OR from unkpk CDN
  <script src="//unpkg.com/ihme-ui/dist/ihme-ui.min.js"></script>
  -->
  <script>
    var chart = React.createElement(ihmeUI.ui.AxisChart, {
      domain: ihmeUI.utils.linspace([3, 10], 200),
      ...
    });
    
    ReactDOM.render(chart, document.getElementById('app'));
  </script>
</body>
</html>
```

In most cases, however, you'll be importing ihme-ui into your project, and bundling it with a module bundler like [Webpack](https://webpack.github.io/) or [Rollup](http://rollupjs.org/). 
In support of this, `ihme-ui` exposes both a CommonJS (i.e., `var ihmeUI = require('ihme-ui')`) and an ES2015 (i.e., `import ihmeUI from 'ihme-ui'`) target.
```javascript
// index.js
import AxisChart from 'ihme-ui/ui/AxisChart';
import { linspace } from 'ihme-ui/utils';

...

```
If you're using [Webpack 2](https://github.com/webpack/webpack#module-formats) or [Rollup](https://github.com/rollup/rollup/wiki/pkg.module), 
you'll automatically pull in the ES2015 build, which allows the module bundler to be [much smarter](http://www.2ality.com/2015/12/webpack-tree-shaking.html) about how it includes this dependecy.

For a more detailed example of how to use this library, see [`starter-app/`](https://github.com/ihmeuw/ihme-ui/tree/master/starter-app).

---