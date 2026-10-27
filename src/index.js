'use strict'

const { Parser } = require('htmlparser2')

const getValue = (value, quote) => {
  if (quote === undefined) return true
  if (value === '1') return true
  return value
}

module.exports = html => {
  const scripts = []
  let attributes = null
  let templateDepth = 0
  const parser = new Parser({
    onopentagname: name => {
      if (name === 'template') templateDepth++
      attributes = name === 'script' && templateDepth === 0 ? {} : null
      if (attributes) scripts.push(attributes)
    },
    onattribute: (name, value, quote) => {
      if (attributes) attributes[name] = getValue(value, quote)
    },
    onclosetag: name => {
      if (name === 'template') templateDepth--
    }
  })
  parser.end(html)
  return scripts
}
