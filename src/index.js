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

module.exports = html => {
  const json = parse(html).filter(({ tagName }) => tagName === 'script')
  return json.map(({ attributes }) => fromPairs(attributes))
}
