'use strict'

const test = require('ava').default

const { elements } = require('../')

test('collect the requested tags in document order', t => {
  t.deepEqual(
    elements(
      '<meta name="a" content="1"><script src="/a.js"></script><meta property="b">',
      ['meta', 'script']
    ),
    {
      meta: [{ name: 'a', content: '1' }, { property: 'b' }],
      script: [{ src: '/a.js' }]
    }
  )
})

test('return an empty list for a tag that is not present', t => {
  t.deepEqual(elements('<p>hello</p>', ['meta', 'script']), {
    meta: [],
    script: []
  })
  t.deepEqual(elements(undefined, ['meta']), { meta: [] })
})

test('keep attribute values as the strings a browser reads', t => {
  t.deepEqual(
    elements('<script src="/a.js" async defer="1"></script>', ['script'])
      .script,
    [{ src: '/a.js', async: '', defer: '1' }]
  )
})

test('keep the first value of a repeated attribute', t => {
  t.deepEqual(elements('<meta name="a" name="b" content="1">', ['meta']).meta, [
    { name: 'a', content: '1' }
  ])
})

test('read attributes named like object properties', t => {
  t.deepEqual(elements('<meta constructor="x" toString="y">', ['meta']).meta, [
    { constructor: 'x', tostring: 'y' }
  ])
})

test('ignore tags inside template, noscript, and raw text', t => {
  t.deepEqual(
    elements(
      '<template><meta name="t"></template><noscript><meta name="n"></noscript><textarea><meta name="x"></textarea><title><meta name="y"></title><meta name="kept">',
      ['meta']
    ).meta,
    [{ name: 'kept' }]
  )
})

test('meta breaks out of svg like the html parser does', t => {
  t.deepEqual(
    elements(
      '<svg><meta name="a"><style><script src="/x.js"></script></style></svg>',
      ['meta', 'script']
    ),
    { meta: [{ name: 'a' }], script: [] }
  )
})

test('read tags written as svg markup', t => {
  t.deepEqual(
    elements('<svg><script src="/a.js"/><a href="/b"></a></svg>', [
      'script',
      'a'
    ]),
    { script: [{ src: '/a.js' }], a: [{ href: '/b' }] }
  )
})
