'use strict'

const { parse } = require('himalaya')

const getValue = value => {
  if (value === null) return true
  if (value === '1') return true
  return value
}

const fromPairs = collection =>
  collection.reduce((acc, { key, value }) => {
    acc[key] = getValue(value)
    return acc
  }, {})

const collectScripts = (nodes, acc = []) => {
  for (const node of nodes) {
    if (node.tagName === 'script') acc.push(node)
    if (node.children) collectScripts(node.children, acc)
  }
  return acc
}

module.exports = html => {
  const scripts = collectScripts(parse(html))
  return scripts.map(({ attributes }) => fromPairs(attributes))
}
