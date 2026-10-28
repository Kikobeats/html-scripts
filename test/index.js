'use strict'

const test = require('ava').default

const parseIframe = require('../')

test('detect scripts nested under html/body', t => {
  const scripts = parseIframe(
    '<html><head><script src="/head.js"></script></head><body><script src="/body.js"></script></body></html>'
  )
  t.deepEqual(scripts, [{ src: '/head.js' }, { src: '/body.js' }])
})

test('detect scripts from twitter iframe', t => {
  const html =
    '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">our new shiny website has landed <a href="https://t.co/KIrhYYcTRx">https://t.co/KIrhYYcTRx</a> <a href="https://t.co/cM0se2UoIg">pic.twitter.com/cM0se2UoIg</a></p>&mdash; microlink.io (@microlinkhq) <a href="https://twitter.com/microlinkhq/status/1032664633960800257?ref_src=twsrc%5Etfw">August 23, 2018</a></blockquote>\n<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>\n'
  const scripts = parseIframe(html)
  t.snapshot(scripts)
})

test('detect scripts from facebook iframe', t => {
  const html =
    '<div id="fb-root"></div>\n<script async="1" defer="1" crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&amp;version=v5.0"></script><div class="fb-post" data-href="https://www.facebook.com/natgeo/videos/10156364216738951/" data-width="552"><blockquote cite="https://www.facebook.com/natgeo/videos/10156364216738951/" class="fb-xfbml-parse-ignore"><p>Enjoy a moment of Zen with Japanese macaques (or snow monkeys) as they soak in natural hot springs.</p>Posted by <a href="https://www.facebook.com/natgeo/">National Geographic</a> on&nbsp;<a href="https://www.facebook.com/natgeo/videos/10156364216738951/">Sunday, April 14, 2019</a></blockquote></div>'
  const scripts = parseIframe(html)
  t.snapshot(scripts)
})

test('detect scripts from instagram iframe', t => {
  const html =
    '<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/BeV6tOhFUor/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="12" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/BeV6tOhFUor/?utm_source=ig_embed&amp;utm_campaign=loading" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;"> View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div></a> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/BeV6tOhFUor/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">First static fire test of Falcon Heavy complete—one step closer to first test flight!</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A post shared by <a href="https://www.instagram.com/spacex/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px;" target="_blank"> SpaceX</a> (@spacex) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2018-01-24T18:39:47+00:00">Jan 24, 2018 at 10:39am PST</time></p></div></blockquote>\n<script async src="//www.instagram.com/embed.js"></script>'
  const scripts = parseIframe(html)
  t.snapshot(scripts)
})

test('lowercase attribute names', t => {
  t.deepEqual(parseIframe('<SCRIPT SRC="/a.js" Async></SCRIPT>'), [
    { src: '/a.js', async: true }
  ])
})

test('decode entities in attribute values', t => {
  t.deepEqual(
    parseIframe('<script src="/a.js?x=1&amp;y=&lt;2&gt;"></script>'),
    [{ src: '/a.js?x=1&y=<2>' }]
  )
})

test('map boolean and "1" attribute values to true', t => {
  t.deepEqual(
    parseIframe(
      '<script async defer="1" data-empty="" data-zero="0"></script>'
    ),
    [{ async: true, defer: true, 'data-empty': '', 'data-zero': '0' }]
  )
})

test('keep the last value of a repeated attribute', t => {
  t.deepEqual(parseIframe('<script src="/a.js" SRC="/b.js"></script>'), [
    { src: '/b.js' }
  ])
})

test('keep unquoted attribute values containing slashes', t => {
  t.deepEqual(
    parseIframe(
      '<script src=https://cdn.example.com/a.js async></script><script type=module src=/m.js></script>'
    ),
    [
      { src: 'https://cdn.example.com/a.js', async: true },
      { type: 'module', src: '/m.js' }
    ]
  )
})

test('detect scripts after a stray closing script tag', t => {
  t.deepEqual(
    parseIframe('<script>a()</script></script><script src="/b.js"></script>'),
    [{}, { src: '/b.js' }]
  )
})

test('ignore markup inside script content and comments', t => {
  t.deepEqual(
    parseIframe(
      '<script>document.write("<script src=x><\\/script>")</script><!-- <script src="/c.js"></script> --><script src="/d.js"></script>'
    ),
    [{}, { src: '/d.js' }]
  )
})

test('ignore scripts inside template', t => {
  t.deepEqual(
    parseIframe(
      '<template><script src="/t.js"></script></template><script src="/after.js"></script>'
    ),
    [{ src: '/after.js' }]
  )
})

test('a self-closing script keeps its content as text until </script>', t => {
  t.deepEqual(
    parseIframe(
      '<script src="/a.js"/>var s = "<script src=/evil.js>";</script><script src="/b.js"></script>'
    ),
    [{ src: '/a.js' }, { src: '/b.js' }]
  )
})

test('a script inside an svg title is a script', t => {
  t.deepEqual(
    parseIframe(
      '<svg><title><script src="/a.js"></script></title></svg><script src="/b.js"></script>'
    ),
    [{ src: '/a.js' }, { src: '/b.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<svg><title><script src="/a.js"/></title></svg><script src="/b.js"></script>'
    ),
    [{ src: '/a.js' }]
  )
})

test('a script inside an html title is text', t => {
  t.deepEqual(
    parseIframe(
      '<title><script src="/a.js"></script></title><script src="/b.js"></script>'
    ),
    [{ src: '/b.js' }]
  )
})

test('a script inside an svg script is still a script', t => {
  t.deepEqual(
    parseIframe(
      '<svg><script><script src="/inner.js"></script></script></svg>'
    ),
    [{}, { src: '/inner.js' }]
  )
})

test('a self-closing script inside svg ends right away', t => {
  t.deepEqual(
    parseIframe(
      '<svg><script href="/x.js"/></svg><script src="/y.js"></script>'
    ),
    [{ href: '/x.js' }, { src: '/y.js' }]
  )
})

test('a self-closing script inside math ends right away', t => {
  t.deepEqual(
    parseIframe(
      '<math><script href="/x.js"/></math><script src="/y.js"></script>'
    ),
    [{ href: '/x.js' }, { src: '/y.js' }]
  )
})

test('closing an integration point returns to foreign content', t => {
  t.deepEqual(
    parseIframe(
      '<svg><desc></desc><script href="/x.js"/></svg><script src="/y.js"></script>'
    ),
    [{ href: '/x.js' }, { src: '/y.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<math><mi></mi><script href="/x.js"/></math><script src="/y.js"></script>'
    ),
    [{ href: '/x.js' }, { src: '/y.js' }]
  )
})

test('a self-closing script inside an html integration point stays open', t => {
  const points = [
    ['svg', 'foreignObject'],
    ['svg', 'desc'],
    ['math', 'mi'],
    ['math', 'mo'],
    ['math', 'mn'],
    ['math', 'ms'],
    ['math', 'mtext']
  ]
  for (const [outer, inner] of points) {
    t.deepEqual(
      parseIframe(
        `<${outer}><${inner}><script src="/a.js"/></${inner}></${outer}><script src="/b.js"></script>`
      ),
      [{ src: '/a.js' }],
      inner
    )
  }
})

test('a script end tag still closes a self-closing html script', t => {
  t.deepEqual(
    parseIframe(
      '<svg><foreignObject><script src="/a.js"/></foreignObject></svg></script><script href="/b.js"></script>'
    ),
    [{ src: '/a.js' }, { href: '/b.js' }]
  )
})

test('annotation-xml stays in math without an html encoding', t => {
  t.deepEqual(
    parseIframe(
      '<math><annotation-xml><script src="/a.js"/></annotation-xml></math><script src="/b.js"></script>'
    ),
    [{ src: '/a.js' }, { src: '/b.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<math><annotation-xml><script src="/a.js"/><script src="/inner.js"></script></annotation-xml></math>'
    ),
    [{ src: '/a.js' }, { src: '/inner.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<math><annotation-xml encoding="text/plain" encoding="text/html"><script src="/a.js"/></annotation-xml></math><script src="/b.js"></script>'
    ),
    [{ src: '/a.js' }, { src: '/b.js' }]
  )
})

test('closing an html annotation-xml returns to math', t => {
  t.deepEqual(
    parseIframe(
      '<math><annotation-xml encoding="text/html"></annotation-xml><script src="/a.js"/></math><script src="/b.js"></script>'
    ),
    [{ src: '/a.js' }, { src: '/b.js' }]
  )
})

test('annotation-xml with an html encoding keeps the script open', t => {
  for (const encoding of ['text/html', 'application/xhtml+xml', 'TEXT/HTML']) {
    t.deepEqual(
      parseIframe(
        `<math><annotation-xml encoding="${encoding}"><script src="/a.js"/></annotation-xml></math><script src="/b.js"></script>`
      ),
      [{ src: '/a.js' }],
      encoding
    )
  }
})

test('a script end tag may have whitespace before >', t => {
  for (const gap of [' ', '\n', '\t', '\r', '\f']) {
    t.deepEqual(
      parseIframe(
        `<div><script src="/a.js"/></div></script${gap}><script src="/b.js"></script>`
      ),
      [{ src: '/a.js' }, { src: '/b.js' }],
      JSON.stringify(gap)
    )
  }
})

test('raw text elements inside svg are markup', t => {
  t.deepEqual(
    parseIframe(
      '<svg><iframe><script src="/a.js"></script></iframe></svg><script src="/b.js"></script>'
    ),
    [{ src: '/a.js' }, { src: '/b.js' }]
  )
})

test('plaintext has no end tag', t => {
  t.deepEqual(
    parseIframe('<plaintext></plaintext><script src="/b.js"></script>'),
    []
  )
})

test('an unclosed script runs to the end of the document', t => {
  t.deepEqual(parseIframe('<script src="/a.js"/><div><script src="/b.js">'), [
    { src: '/a.js' }
  ])
})

test('an unquoted slash is part of the attribute value', t => {
  t.deepEqual(parseIframe('<script src=a/><script src="/b.js"></script>'), [
    { src: 'a/' }
  ])
})

test('an end tag inside a script does not close the element around it', t => {
  t.deepEqual(
    parseIframe(
      '<template><script src="/a.js"/></template></script><script src="/b.js"></script>'
    ),
    []
  )
})

test('raw text elements hide the scripts inside them', t => {
  for (const tag of [
    'iframe',
    'noembed',
    'noframes',
    'noscript',
    'style',
    'textarea',
    'title',
    'xmp'
  ]) {
    t.deepEqual(
      parseIframe(
        `<${tag}><script src="/a.js"></script></${tag}><script src="/b.js"></script>`
      ),
      [{ src: '/b.js' }],
      tag
    )
  }
  t.deepEqual(
    parseIframe(
      '<script src="/a.js"></script><plaintext><script src="/b.js"></script>'
    ),
    [{ src: '/a.js' }]
  )
})

test('an implied end tag does not end an html script', t => {
  t.deepEqual(
    parseIframe('<script src="/a.js"/><body><script src="/b.js"></script>'),
    [{ src: '/a.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<div><script src="/a.js"/></div><script src="/b.js"></script>'
    ),
    [{ src: '/a.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<head><script src="/a.js"></script></head><body><script src="/b.js"></script>'
    ),
    [{ src: '/a.js' }, { src: '/b.js' }]
  )
})

test('non-string input is read as a string', t => {
  t.deepEqual(parseIframe(Buffer.from('<script src="/buf.js"></script>')), [
    { src: '/buf.js' }
  ])
  t.deepEqual(parseIframe(undefined), [])
})

test('a stray </template> after a self-closing script keeps later scripts', t => {
  t.deepEqual(
    parseIframe(
      '<script src="/a.js"/><template><script></script></template><script src="/b.js"></script>'
    ),
    [{ src: '/a.js' }, { src: '/b.js' }]
  )
})

test('noscript ends at its own end tag', t => {
  const cases = [
    '<noscript><noembed></noscript><script src="/a.js"></script>',
    '<noscript><iframe></noscript><script src="/a.js"></script>',
    '<noscript><script></noscript><script src="/a.js"></script>',
    '<div><noscript></div><script src="/x.js"></script></noscript><script src="/a.js"></script>',
    '<noscript><template></noscript ><script src="/a.js"></script>',
    '<noscript></noscript/><script src="/a.js"></script>'
  ]
  for (const html of cases) {
    t.deepEqual(parseIframe(html), [{ src: '/a.js' }], html)
  }
  t.deepEqual(parseIframe('<noscript><script src="/a.js"></script>'), [])
  for (const gap of [' ', '\n', '\t', '\r', '\f']) {
    t.deepEqual(
      parseIframe(`<noscript></noscript${gap}><script src="/a.js"></script>`),
      [{ src: '/a.js' }],
      JSON.stringify(gap)
    )
  }
  t.deepEqual(
    parseIframe('<NOSCRIPT></NOSCRIPT><script src="/a.js"></script>'),
    [{ src: '/a.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<noscript></noscript><script src="/a.js"></script><noscript></noscript><script src="/b.js"></script>'
    ),
    [{ src: '/a.js' }, { src: '/b.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<noscript></noscript <script src="/a.js"></script><script src="/b.js"></script>'
    ),
    [{ src: '/b.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<svg><noscript><script src="/a.js"></script></noscript><script src="/b.js"/></svg>'
    ),
    [{ src: '/a.js' }, { src: '/b.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<svg><foreignObject><noscript><script src="/a.js"></script></noscript><script src="/b.js"></script></foreignObject></svg>'
    ),
    [{ src: '/b.js' }]
  )
})

test('integration points depend on the namespace', t => {
  const cases = [
    '<math><title/><script src="/a.js"/><script src="/b.js"></script></math>',
    '<svg><desc/><script src="/a.js"/><script src="/b.js"></script></svg>',
    '<svg><mi><script src="/a.js"/><script src="/b.js"></script></mi></svg>'
  ]
  for (const html of cases) {
    t.deepEqual(parseIframe(html), [{ src: '/a.js' }, { src: '/b.js' }], html)
  }
  t.deepEqual(
    parseIframe(
      '<svg><annotation-xml><foreignObject><script src="/a.js"/><script src="/b.js"></script></foreignObject></annotation-xml></svg>'
    ),
    [{ src: '/a.js' }]
  )
})

test('html start tags break out of foreign content', t => {
  const tags = [
    'b',
    'big',
    'blockquote',
    'body',
    'br',
    'center',
    'code',
    'dd',
    'div',
    'dl',
    'dt',
    'em',
    'embed',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'head',
    'hr',
    'i',
    'img',
    'li',
    'listing',
    'menu',
    'meta',
    'nobr',
    'ol',
    'p',
    'pre',
    'ruby',
    's',
    'small',
    'span',
    'strike',
    'strong',
    'sub',
    'sup',
    'table',
    'tt',
    'u',
    'ul',
    'var'
  ]
  for (const tag of tags) {
    t.deepEqual(
      parseIframe(
        `<svg><${tag}><style><script src="/a.js"></script></style><script src="/b.js"></script>`
      ),
      [{ src: '/b.js' }],
      tag
    )
  }
  t.deepEqual(
    parseIframe(
      '<svg></p><style><script src="/a.js"></script></style><script src="/b.js"></script>'
    ),
    [{ src: '/b.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<svg></br><style><script src="/a.js"></script></style><script src="/b.js"></script>'
    ),
    [{ src: '/b.js' }]
  )
  for (const attribute of ['color', 'face', 'size', 'COLOR']) {
    t.deepEqual(
      parseIframe(
        `<svg><font ${attribute}="red"><style><script src="/a.js"></script></style></svg>`
      ),
      [],
      attribute
    )
  }
  t.deepEqual(
    parseIframe(
      '<svg><font color><style><script src="/a.js"></script></style>'
    ),
    []
  )
  t.deepEqual(
    parseIframe(
      '<svg><font><style><script src="/a.js"></script></style></font></svg>'
    ),
    [{ src: '/a.js' }]
  )
})

test('a template inside svg is not inert', t => {
  t.deepEqual(
    parseIframe(
      '<svg><template><script src="/a.js"></script></template></svg>'
    ),
    [{ src: '/a.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<template><svg><template></template></svg><script src="/x.js"></script></template><script src="/a.js"></script>'
    ),
    [{ src: '/a.js' }]
  )
})

test('svg and math keep the namespace they are nested in', t => {
  t.deepEqual(
    parseIframe(
      '<math><svg><annotation-xml encoding="text/html"><style><script src="/a.js"></script></style></annotation-xml></svg></math>'
    ),
    []
  )
  t.deepEqual(
    parseIframe(
      '<svg><math><desc><style><script src="/a.js"></script></style></desc></math></svg>'
    ),
    []
  )
})

test('a script tag cut off at the end of the input is not a script', t => {
  t.deepEqual(parseIframe('<script src="/a'), [])
  t.deepEqual(parseIframe('<p><script src="/a.js"></script><script src="/b'), [
    { src: '/a.js' }
  ])
})

test('mglyph and malignmark inside a math text integration point stay in math', t => {
  const cases = [
    '<math><mi><mglyph><style><script src="/a.js"></script></style></mglyph></mi><script src="/b.js"/></math>',
    '<math><mo><malignmark><style><script src="/a.js"></script></style></malignmark></mo><script src="/b.js"/></math>',
    '<math><mn><mglyph><script src="/a.js"/></mglyph></mn><script src="/b.js"/></math>',
    '<math><ms><malignmark><script src="/a.js"/></malignmark></ms><script src="/b.js"/></math>',
    '<math><mtext><mglyph><style><script src="/a.js"></script></style></mglyph></mtext><script src="/b.js"/></math>',
    '<math><mi><MGLYPH><style><script src="/a.js"></script></style></MGLYPH></mi><script src="/b.js"/></math>'
  ]
  for (const html of cases) {
    t.deepEqual(parseIframe(html), [{ src: '/a.js' }, { src: '/b.js' }], html)
  }
  t.deepEqual(
    parseIframe(
      '<math><mglyph><script src="/a.js"/></mglyph><script src="/b.js"/></math>'
    ),
    [{ src: '/a.js' }, { src: '/b.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<svg><foreignObject><mglyph><script src="/a.js"/></mglyph><script src="/b.js"></script></foreignObject></svg>'
    ),
    [{ src: '/a.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<mi><mglyph><style><script src="/a.js"></script></style></mglyph><script src="/b.js"></script>'
    ),
    [{ src: '/b.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<math><mi><mglyph></mglyph></mi><script src="/a.js"/><script src="/b.js"/></math>'
    ),
    [{ src: '/a.js' }, { src: '/b.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<math><mi><mrow><mglyph><style><script src="/a.js"></script></style></mglyph></mrow></mi><script src="/b.js"/></math>'
    ),
    [{ src: '/b.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<math><mi><mglyph/><script src="/a.js"/></mi><script src="/b.js"/></math>'
    ),
    [{ src: '/a.js' }]
  )
})

test('svg directly inside a math annotation-xml is svg', t => {
  t.deepEqual(
    parseIframe(
      '<math><annotation-xml><svg><desc><style><script src="/a.js"></script></style></desc></svg></annotation-xml></math>'
    ),
    []
  )
  t.deepEqual(
    parseIframe(
      '<math><annotation-xml><mrow><svg><desc><style><script src="/a.js"></script></style></desc></svg></mrow></annotation-xml></math>'
    ),
    [{ src: '/a.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<math><annotation-xml><mi></mi><svg><desc><style><script src="/a.js"></script></style></desc></svg></annotation-xml></math>'
    ),
    []
  )
})

test('a raw-text end tag may end with a solidus', t => {
  t.deepEqual(
    parseIframe('<script src="/a.js"></script/><script src="/b.js"></script>'),
    [{ src: '/a.js' }, { src: '/b.js' }]
  )
  t.deepEqual(
    parseIframe('<script src="/a.js"></SCRIPT/><script src="/b.js"></script>'),
    [{ src: '/a.js' }, { src: '/b.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<div><script src="/a.js"></script/foo></div><script src="/b.js"></script>'
    ),
    [{ src: '/a.js' }, { src: '/b.js' }]
  )
  t.deepEqual(
    parseIframe(
      '<script src="/a.js">var x="</script/><script src=\'/evil.js\'>"</script><script src="/b.js"></script>'
    ),
    [{ src: '/a.js' }, { src: '/evil.js' }, { src: '/b.js' }]
  )
  for (const tag of ['style', 'title', 'textarea', 'xmp']) {
    t.deepEqual(
      parseIframe(`<${tag}></${tag}/><script src="/b.js"></script>`),
      [{ src: '/b.js' }],
      tag
    )
  }
  t.deepEqual(
    parseIframe(
      '<script src="/a.js"></scripting><script src="/b.js"></script>'
    ),
    [{ src: '/a.js' }]
  )
})
