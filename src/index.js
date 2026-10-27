'use strict'

const { dirname, join } = require('path')

const { Parser } = require('htmlparser2')
const Tokenizer = require(join(
  dirname(require.resolve('htmlparser2')),
  'Tokenizer.js'
)).default

// htmlparser2 treats title/textarea/style/script as raw text everywhere.
// In svg/math that is only true for HTML, so parse those tags as markup.
const IN_TAG_NAME = 3

class ForeignTokenizer extends Tokenizer {
  stateBeforeSpecialS (char) {
    if (this.cbs.foreignContext[0] === true) {
      this.state = IN_TAG_NAME
      this.stateInTagName(char)
      return
    }
    super.stateBeforeSpecialS(char)
  }

  stateBeforeSpecialT (char) {
    if (this.cbs.foreignContext[0] === true) {
      this.state = IN_TAG_NAME
      this.stateInTagName(char)
      return
    }
    super.stateBeforeSpecialT(char)
  }
}

// svg/math are foreign content. These elements switch back to HTML.
// annotation-xml does that only with an HTML encoding, so it is handled apart.
const FOREIGN_ELEMENTS = new Set(['math', 'svg'])
const HTML_INTEGRATION_ELEMENTS = new Set([
  'desc',
  'foreignobject',
  'mi',
  'mn',
  'mo',
  'ms',
  'mtext',
  'title'
])
// style, textarea, xmp, and script are raw in HTML via the tokenizer.
const RAW_TEXT_ELEMENTS = new Set([
  'iframe',
  'noembed',
  'noframes',
  'noscript',
  'plaintext'
])
const getValue = (value, quote) => {
  if (quote === undefined) return true
  if (value === '1') return true
  return value
}

const isHtmlEncoding = value => {
  const mime = value.toLowerCase()
  return mime === 'text/html' || mime === 'application/xhtml+xml'
}

const isWhitespace = code =>
  code === 9 || code === 10 || code === 12 || code === 13 || code === 32

// Index of the `</script` that ends an HTML script, or the end of the string.
const findScriptEnd = (source, from) => {
  for (
    let index = source.indexOf('<', from);
    index !== -1;
    index = source.indexOf('<', index + 1)
  ) {
    if (source.slice(index, index + 8).toLowerCase() !== '</script') continue
    const next = source.charCodeAt(index + 8)
    if (next === 62 || isWhitespace(next)) return index
  }
  return source.length
}

const isForeignContextElement = name =>
  FOREIGN_ELEMENTS.has(name) || HTML_INTEGRATION_ELEMENTS.has(name)

module.exports = html => {
  const source = String(html)
  const scripts = []
  let attributes = null
  let templateDepth = 0
  let isInScript = false
  // Taken when the script opens. htmlparser2 pops an integration point
  // before the implied close, so the close event is too late to read.
  let scriptInForeign = false
  // htmlparser2 drops script-data mode on `<script/>` and then swallows the
  // real `</script>`. Events before this index are still that script's text.
  let scriptEnd = -1
  let rawText = null
  let sawAnnotation = false
  let annotationHtml = false
  let sawAnnotationEncoding = false
  const annotationHtmlStack = []
  const foreignContext = [false]
  const leaveScriptIfEnded = () => {
    if (scriptEnd !== -1 && parser.endIndex >= scriptEnd) {
      isInScript = false
      scriptEnd = -1
    }
  }
  const parser = new Parser(
    {
      onopentagname: name => {
        leaveScriptIfEnded()
        attributes = null
        if (isInScript || rawText) return
        if (FOREIGN_ELEMENTS.has(name)) foreignContext.unshift(true)
        else if (HTML_INTEGRATION_ELEMENTS.has(name)) {
          foreignContext.unshift(false)
        }
        if (name === 'annotation-xml') sawAnnotation = true
        // These elements are raw text in HTML only. In svg/math they are markup.
        if (RAW_TEXT_ELEMENTS.has(name) && foreignContext[0] !== true) {
          rawText = name
          return
        }
        if (name === 'template') templateDepth++
        if (name !== 'script') return
        scriptInForeign = foreignContext[0] === true
        // A foreign script does not swallow the markup inside it.
        if (!scriptInForeign) isInScript = true
        if (templateDepth === 0) {
          attributes = {}
          scripts.push(attributes)
        }
      },
      onattribute: (name, value, quote) => {
        if (sawAnnotation && name === 'encoding' && !sawAnnotationEncoding) {
          sawAnnotationEncoding = true
          annotationHtml = isHtmlEncoding(value)
        }
        if (attributes) attributes[name] = getValue(value, quote)
      },
      onopentag: name => {
        if (name === 'annotation-xml' && sawAnnotation) {
          annotationHtmlStack.unshift(annotationHtml)
          if (annotationHtml) foreignContext.unshift(false)
          sawAnnotation = false
          annotationHtml = false
          sawAnnotationEncoding = false
        }
        if (name !== 'script' || !isInScript) return
        scriptEnd = findScriptEnd(source, parser.endIndex + 1)
      },
      onclosetag: (name, isImplied) => {
        leaveScriptIfEnded()
        if (rawText) {
          if (name === rawText && name !== 'plaintext') rawText = null
          return
        }
        if (name === 'script') {
          if (!isImplied || scriptInForeign) {
            isInScript = false
            scriptEnd = -1
          }
          return
        }
        if (isInScript) return
        if (name === 'annotation-xml') {
          if (annotationHtmlStack.shift()) foreignContext.shift()
          return
        }
        if (isForeignContextElement(name)) foreignContext.shift()
        if (name === 'template' && templateDepth > 0) templateDepth--
      }
    },
    { Tokenizer: ForeignTokenizer }
  )
  parser.end(source)
  return scripts
}
