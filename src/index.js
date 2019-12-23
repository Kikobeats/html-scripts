'use strict'

const { parse } = require('himalaya')

const fromPairs = collection =>
  collection.reduce(
    (acc, { key, value }) => ({
      ...acc,
      [key]: value
    }),
    {}
  )

module.exports = html => {
  const json = parse(html).filter(({ tagName }) => tagName === 'script')
  return json.map(({ attributes }) => fromPairs(attributes))
}
