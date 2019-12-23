# html-scripts

![Last version](https://img.shields.io/github/tag/Kikobeats/html-scripts.svg?style=flat-square)
[![Build Status](https://img.shields.io/travis/com/Kikobeats/html-scripts/master.svg?style=flat-square)](https://travis-ci.com/Kikobeats/html-scripts)
[![Coverage Status](https://img.shields.io/coveralls/Kikobeats/html-scripts.svg?style=flat-square)](https://coveralls.io/github/Kikobeats/html-scripts)
[![Dependency status](https://img.shields.io/david/Kikobeats/html-scripts.svg?style=flat-square)](https://david-dm.org/Kikobeats/html-scripts)
[![Dev Dependencies Status](https://img.shields.io/david/dev/Kikobeats/html-scripts.svg?style=flat-square)](https://david-dm.org/Kikobeats/html-scripts#info=devDependencies)
[![NPM Status](https://img.shields.io/npm/dm/html-scripts.svg?style=flat-square)](https://www.npmjs.org/package/html-scripts)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg?style=flat-square)](https://paypal.me/Kikobeats)

> It parses HTML markup and returns you all the scripts.

## Install

```bash
$ npm install html-scripts --save
```

## Usage

```js
const getScripts = require('html-scripts')

const scripts = getScripts('<blockquote class="twitter-tweet"><p lang="en" dir="ltr">our new shiny website has landed <a href="https://t.co/KIrhYYcTRx">https://t.co/KIrhYYcTRx</a> <a href="https://t.co/cM0se2UoIg">pic.twitter.com/cM0se2UoIg</a></p>&mdash; microlink.io (@microlinkhq) <a href="https://twitter.com/microlinkhq/status/1032664633960800257?ref_src=twsrc%5Etfw">August 23, 2018</a></blockquote>\n<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>\n')

console.log(scripts)
// [
//   {
//     async: null,
//     charset: 'utf-8',
//     src: 'https://platform.twitter.com/widgets.js',
//   },
// ]
```

## License

**html-scripts** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/Kikobeats/html-scripts/blob/master/LICENSE.md) License.<br>
Authored and maintained by Kiko Beats with help from [contributors](https://github.com/Kikobeats/html-scripts/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/Kikobeats) · Twitter [@Kikobeats](https://twitter.com/Kikobeats)
