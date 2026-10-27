# html-scripts

[![Last version](https://img.shields.io/github/v/tag/Kikobeats/html-scripts?style=flat-square)](https://github.com/Kikobeats/html-scripts/releases)
[![Coverage Status](https://img.shields.io/coverallsCoverage/github/Kikobeats/html-scripts?style=flat-square)](https://coveralls.io/github/Kikobeats/html-scripts)
[![NPM Status](https://img.shields.io/npm/dm/html-scripts?style=flat-square)](https://www.npmjs.com/package/html-scripts)

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

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/Kikobeats) · X [@Kikobeats](https://x.com/Kikobeats)
