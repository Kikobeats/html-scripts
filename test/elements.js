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
  const proto = '__proto__'
  const [meta] = elements('<meta constructor="x" toString="y" __proto__="z">', [
    'meta'
  ]).meta
  t.is(meta.constructor, 'x')
  t.is(meta.tostring, 'y')
  t.is(meta[proto], 'z')
  t.true(Object.hasOwn(meta, proto))
  t.is(Object.getPrototypeOf(meta), Object.prototype)
  const [first] = elements('<meta __proto__="z" __proto__="later">', [
    'meta'
  ]).meta
  t.is(first[proto], 'z')
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

test('collect an html template element but not the tags inside it', t => {
  t.deepEqual(
    elements(
      '<template id="outer"><meta name="in"><template id="inner"></template></template><template id="after"></template><meta name="out">',
      ['template', 'meta']
    ),
    {
      template: [{ id: 'outer' }, { id: 'after' }],
      meta: [{ name: 'out' }]
    }
  )
})

test('an svg title stays an html integration point when it is collected', t => {
  t.deepEqual(
    elements(
      '<svg><title id="t"><script src="/a.js"/></title></svg><script src="/b.js"></script>',
      ['title', 'script']
    ),
    { title: [{ id: 't' }], script: [{ src: '/a.js' }] }
  )
})

test('collecting mi still keeps mglyph in math', t => {
  t.deepEqual(
    elements(
      '<math><mi id="i"><mglyph><style><script src="/a.js"></script></style></mglyph></mi><script src="/b.js"/></math>',
      ['mi', 'script']
    ),
    { mi: [{ id: 'i' }], script: [{ src: '/a.js' }, { src: '/b.js' }] }
  )
})

test('collecting annotation-xml still keeps a direct svg child in svg', t => {
  t.deepEqual(
    elements(
      '<math><annotation-xml id="a"><svg><desc><style><script src="/a.js"></script></style></desc></svg></annotation-xml></math>',
      ['annotation-xml', 'script']
    ),
    { 'annotation-xml': [{ id: 'a' }], script: [] }
  )
})

test('collecting annotation-xml still honors an html encoding', t => {
  t.deepEqual(
    elements(
      '<math><annotation-xml encoding="text/html"><script src="/a.js"/></annotation-xml></math><script src="/b.js"></script>',
      ['annotation-xml', 'script']
    ),
    {
      'annotation-xml': [{ encoding: 'text/html' }],
      script: [{ src: '/a.js' }]
    }
  )
})

test('collecting font still breaks out of svg on a breakout attribute', t => {
  t.deepEqual(
    elements(
      '<svg><font color="red"><style><script src="/a.js"></script></style></svg>',
      ['font', 'script']
    ),
    { font: [{ color: 'red' }], script: [] }
  )
  t.deepEqual(
    elements(
      '<svg><font><style><script src="/a.js"></script></style></font></svg>',
      ['font', 'script']
    ),
    { font: [{}], script: [{ src: '/a.js' }] }
  )
})

test('read svg noscript content when scripting is off', t => {
  const html = '<svg><noscript><a href="/a"></a></noscript></svg>'
  const expected = { noscript: [{}], a: [{ href: '/a' }] }
  t.deepEqual(elements(html, ['noscript', 'a']), expected)
  t.deepEqual(elements(html, ['noscript', 'a'], { scripting: false }), expected)
})

test('reject tag names that are not an array', t => {
  t.throws(() => elements('<meta name="a">', 'meta'), { instanceOf: TypeError })
})

test('requesting __proto__ does not replace the result prototype', t => {
  const proto = '__proto__'
  const result = elements('<meta name="m">', [proto, 'meta'])
  t.is(Object.getPrototypeOf(result), Object.prototype)
  t.true(Object.hasOwn(result, proto))
  t.deepEqual(result[proto], [])
  t.deepEqual(result.meta, [{ name: 'm' }])
})

test('read noscript content as markup when scripting is off', t => {
  const html =
    '<noscript><meta name="n"><script src="/n.js"></script></noscript><meta name="kept">'
  t.deepEqual(elements(html, ['meta', 'script']), {
    meta: [{ name: 'kept' }],
    script: []
  })
  t.deepEqual(elements(html, ['meta', 'script'], null), {
    meta: [{ name: 'kept' }],
    script: []
  })
  t.deepEqual(elements(html, ['meta', 'script'], { scripting: false }), {
    meta: [{ name: 'n' }, { name: 'kept' }],
    script: [{ src: '/n.js' }]
  })
})
