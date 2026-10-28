'use strict'

const { Parser } = require('htmlparser2')

const HTML = 'html'
const SVG = 'svg'
const MATH = 'math'
const ANNOTATION_XML = 'annotation-xml'

const SVG_HTML_INTEGRATION_POINTS = new Set([
  'desc',
  'foreignObject',
  'foreignobject',
  'title'
])
const MATH_TEXT_INTEGRATION_POINTS = new Set(['mi', 'mn', 'mo', 'ms', 'mtext'])
// These stay in MathML even when the current node is a text integration point.
const MATH_TEXT_INTEGRATION_EXCEPTIONS = new Set(['malignmark', 'mglyph'])

const FOREIGN_CONTENT_BREAKOUT_ELEMENTS = new Set([
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
])
const FONT_BREAKOUT_ATTRIBUTES = new Set(['color', 'face', 'size'])
const INTEGRATION_CANDIDATES = new Set([
  ...SVG_HTML_INTEGRATION_POINTS,
  ...MATH_TEXT_INTEGRATION_POINTS,
  ANNOTATION_XML
])
const NAMESPACE_STACK_ELEMENTS = new Set([SVG, MATH, ...INTEGRATION_CANDIDATES])

const NOSCRIPT_END = /<\/noscript[\t\n\f\r />]/gi

const SCRIPT_TAGS = ['script']

const getValue = (value, quote) => {
  if (quote === undefined) return true
  if (value === '1') return true
  return value
}

const setLastValue = (attributes, name, value, quote) => {
  attributes[name] = getValue(value, quote)
}

const setFirstValue = (attributes, name, value) => {
  if (!Object.hasOwn(attributes, name)) attributes[name] = value
}

const isHtmlEncoding = value => {
  const mime = value.toLowerCase()
  return mime === 'text/html' || mime === 'application/xhtml+xml'
}

const isIntegrationPoint = (namespace, name, encoding) => {
  if (namespace === SVG) return SVG_HTML_INTEGRATION_POINTS.has(name)
  if (namespace !== MATH) return false
  if (name === ANNOTATION_XML) {
    return encoding !== null && isHtmlEncoding(encoding)
  }
  return MATH_TEXT_INTEGRATION_POINTS.has(name)
}

const findNoscriptEnd = (source, from) => {
  NOSCRIPT_END.lastIndex = from
  const match = NOSCRIPT_END.exec(source)
  return match === null ? source.length : match.index
}

// The tokenizer increments index after this callback returns.
const continueTokenizingFrom = (parser, index) => {
  parser.tokenizer.index = index - 1
}

const extract = (html, tagNames, setAttribute) => {
  const source = String(html)
  const targets = new Set(tagNames)
  const elements = {}
  for (const name of targets) elements[name] = []
  const namespaces = [HTML]
  const templates = []
  const mathAnnotationDepths = []
  const mathTextIntegrationDepths = []
  const mathExceptionDepths = []
  let depth = 0
  let htmlTemplateDepth = 0
  let tagName = ''
  let attributes = null
  let encoding = null
  let hasFontBreakoutAttribute = false

  const isInForeignContent = () => namespaces[0] !== HTML

  const isChildOfMathAnnotation = () => mathAnnotationDepths[0] === depth - 1

  const isMathTextIntegrationException = name =>
    MATH_TEXT_INTEGRATION_EXCEPTIONS.has(name) &&
    mathTextIntegrationDepths[0] === depth - 1

  const namespaceOfNested = name => {
    if (!isInForeignContent()) return name
    if (name === SVG && isChildOfMathAnnotation()) return SVG
    return namespaces[0]
  }

  const breakOutOfForeignContent = () => {
    for (let index = 0; namespaces[index] !== HTML; index++) {
      namespaces[index] = HTML
    }
  }

  const parser = new Parser({
    onopentagname: name => {
      depth++
      tagName = name
      attributes = null
      encoding = null
      hasFontBreakoutAttribute = false
      if (FOREIGN_CONTENT_BREAKOUT_ELEMENTS.has(name)) {
        breakOutOfForeignContent()
      }
      if (name === SVG || name === MATH) {
        namespaces.unshift(namespaceOfNested(name))
      } else if (isMathTextIntegrationException(name)) {
        namespaces.unshift(MATH)
        mathExceptionDepths.unshift(depth)
      } else if (name === 'template') {
        const isHtmlTemplate = !isInForeignContent()
        templates.unshift(isHtmlTemplate)
        if (isHtmlTemplate) htmlTemplateDepth++
      }
      if (htmlTemplateDepth === 0 && targets.has(name)) attributes = {}
    },
    onattribute: (name, value, quote) => {
      if (attributes !== null) setAttribute(attributes, name, value, quote)
      if (tagName === ANNOTATION_XML) {
        if (name === 'encoding' && encoding === null) encoding = value
      } else if (tagName === 'font' && FONT_BREAKOUT_ATTRIBUTES.has(name)) {
        hasFontBreakoutAttribute = true
      }
    },
    onopentag: name => {
      if (attributes !== null) elements[name].push(attributes)
      if (INTEGRATION_CANDIDATES.has(name)) {
        const namespace = namespaces[0]
        const isHtml = isIntegrationPoint(namespace, name, encoding)
        namespaces.unshift(isHtml ? HTML : namespace)
        if (name === ANNOTATION_XML && namespace === MATH) {
          mathAnnotationDepths.unshift(depth)
        } else if (isHtml && MATH_TEXT_INTEGRATION_POINTS.has(name)) {
          mathTextIntegrationDepths.unshift(depth)
        }
      } else if (name === 'noscript') {
        if (!isInForeignContent()) {
          continueTokenizingFrom(
            parser,
            findNoscriptEnd(source, parser.endIndex + 1)
          )
        }
      } else if (name === 'font' && hasFontBreakoutAttribute) {
        breakOutOfForeignContent()
      }
    },
    onclosetag: name => {
      if (mathExceptionDepths[0] === depth) {
        mathExceptionDepths.shift()
        namespaces.shift()
      } else if (NAMESPACE_STACK_ELEMENTS.has(name)) {
        namespaces.shift()
        if (mathAnnotationDepths[0] === depth) mathAnnotationDepths.shift()
        if (mathTextIntegrationDepths[0] === depth) {
          mathTextIntegrationDepths.shift()
        }
      } else if (name === 'template' && templates.shift()) {
        htmlTemplateDepth--
      }
      depth--
    }
  })
  parser.isInForeignContext = isInForeignContent
  parser.end(source)
  return elements
}

module.exports = html => extract(html, SCRIPT_TAGS, setLastValue).script

module.exports.elements = (html, tagNames) =>
  extract(html, tagNames, setFirstValue)
