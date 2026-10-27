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
  let isInScript = false
  const parser = new Parser({
    onopentagname: name => {
      attributes = null
      if (isInScript) return
      if (name === 'template') templateDepth++
      if (name !== 'script') return
      isInScript = true
      if (templateDepth === 0) {
        attributes = {}
        scripts.push(attributes)
      }
    },
    onattribute: (name, value, quote) => {
      if (attributes) attributes[name] = getValue(value, quote)
    },
    onclosetag: name => {
      if (name === 'script') {
        isInScript = false
        return
      }
      if (isInScript) return
      if (name === 'template') templateDepth--
    }
  })
  parser.end(String(html))
  return scripts
}
