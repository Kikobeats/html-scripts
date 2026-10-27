'use strict'

const { writeFileSync } = require('node:fs')
const { join } = require('node:path')

const getScripts = require('..')

const RUNS = 7
const SEED = 0x5eed

const LARGE_PAGE_BYTES = 1024 * 1024
const LARGE_PAGE_SCRIPTS = 200
const LARGE_PAGE_ITERATIONS = 6

const SMALL_PAGE_BYTES = 20 * 1024
const SMALL_PAGE_SCRIPTS = 12
const SMALL_PAGE_ITERATIONS = 400

const createRandom = seed => {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

const pick = (random, list) => list[Math.floor(random() * list.length)]

const WORDS = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'labore',
  'magna',
  'aliqua'
]

const CDNS = [
  'https://cdn.example.com/lib',
  'https://www.googletagmanager.com/gtag',
  '//connect.facebook.net/en_US',
  '/static/js',
  'https://unpkg.com/pkg@1.0.0/dist'
]

const sentence = (random, words) =>
  Array.from({ length: words }, () => pick(random, WORDS)).join(' ')

const scriptTag = (random, index) => {
  const kind = index % 5
  if (kind === 0) {
    return `<script src="${pick(random, CDNS)}/bundle-${index}.js"></script>`
  }
  if (kind === 1) {
    return `<script async defer crossorigin="anonymous" src="${pick(
      random,
      CDNS
    )}/sdk-${index}.js#v=${index}" charset="utf-8"></script>`
  }
  if (kind === 2) {
    return `<script type="module" data-id="${index}" integrity="sha384-${index
      .toString(16)
      .padStart(8, '0')}" src="/m/${index}.mjs"></script>`
  }
  if (kind === 3) {
    return `<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"${sentence(
      random,
      6
    )}","position":${index}}</script>`
  }
  return `<script>window.__data${index} = { id: ${index}, label: "${sentence(
    random,
    8
  )}", ready: function () { return ${index} > 0 } };</script>`
}

const fillerBlock = random =>
  `<section class="card c-${Math.floor(random() * 100)}"><h2>${sentence(
    random,
    4
  )}</h2>` +
  `<p style="margin:0;padding:4px">${sentence(
    random,
    40
  )} <a href="/p/${Math.floor(random() * 1e6)}">${sentence(
    random,
    3
  )}</a></p>` +
  `<ul><li>${sentence(random, 5)}</li><li>${sentence(random, 5)}</li></ul>` +
  '<img src="/i.png" alt="" width="10" height="10"></section>\n'

const buildPage = ({ bytes, scripts }) => {
  const random = createRandom(SEED)
  const head =
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>bench</title></head><body>\n'
  const tail = '</body></html>\n'
  const fillerBudget = Math.max(0, bytes - head.length - tail.length)
  const perGap = fillerBudget / scripts
  const parts = [head]
  let size = head.length
  for (let index = 0; index < scripts; index++) {
    const tag = scriptTag(random, index)
    parts.push(tag, '\n')
    size += tag.length + 1
    const gapEnd = head.length + perGap * (index + 1)
    while (size < gapEnd) {
      const block = fillerBlock(random)
      parts.push(block)
      size += block.length
    }
  }
  parts.push(tail)
  return parts.join('')
}

const CASES = [
  {
    name: 'getScripts 1MB page',
    html: buildPage({ bytes: LARGE_PAGE_BYTES, scripts: LARGE_PAGE_SCRIPTS }),
    scripts: LARGE_PAGE_SCRIPTS,
    iterations: LARGE_PAGE_ITERATIONS
  },
  {
    name: 'getScripts 20KB page',
    html: buildPage({ bytes: SMALL_PAGE_BYTES, scripts: SMALL_PAGE_SCRIPTS }),
    scripts: SMALL_PAGE_SCRIPTS,
    iterations: SMALL_PAGE_ITERATIONS
  }
]

const median = values => {
  const sorted = values.slice().sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

const assertScripts = (entry, scripts) => {
  if (!Array.isArray(scripts) || scripts.length !== entry.scripts) {
    throw new Error(
      `${entry.name}: expected ${entry.scripts} scripts, got ${scripts &&
        scripts.length}`
    )
  }
  if (
    !scripts[0].src.endsWith('/bundle-0.js') ||
    scripts[2].type !== 'module'
  ) {
    throw new Error(
      `${entry.name}: unexpected attributes ${JSON.stringify(
        scripts.slice(0, 3)
      )}`
    )
  }
}

const runOnce = entry => {
  for (let i = 0; i < entry.iterations; i++) {
    assertScripts(entry, getScripts(entry.html))
  }
}

const sample = entry => {
  const samples = []
  let errors = 0
  for (let run = 0; run < RUNS; run++) {
    const started = process.hrtime.bigint()
    try {
      runOnce(entry)
      samples.push(Number(process.hrtime.bigint() - started) / 1e6)
    } catch (error) {
      errors++
      console.error(error.message)
    }
  }
  return { samples, errors }
}

const report = (entry, { samples, errors }) => {
  const med = samples.length ? median(samples) : Number.NaN
  const min = samples.length ? Math.min(...samples).toFixed(1) : 'n/a'
  const max = samples.length ? Math.max(...samples).toFixed(1) : 'n/a'
  const extra =
    `work ${entry.iterations} calls, ${entry.html.length} bytes, ` +
    `${entry.scripts} scripts, errors ${errors}, runs ${RUNS}`
  console.log(
    `${entry.name}  median ${med.toFixed(1)}ms  range ${min}-${max}  ${extra}`
  )
  return {
    name: entry.name,
    unit: 'ms',
    value: Number(med.toFixed(1)),
    range: `${min}-${max}`,
    extra
  }
}

const main = () => {
  const results = []
  let errors = 0
  for (const entry of CASES) {
    try {
      runOnce(entry)
    } catch (error) {
      errors++
      console.error(error.message)
    }
    const result = sample(entry)
    errors += result.errors
    results.push(report(entry, result))
  }
  writeFileSync(
    join(__dirname, '..', 'benchmark-output.json'),
    JSON.stringify(results, null, 2) + '\n'
  )
  if (errors > 0 || results.some(result => !Number.isFinite(result.value))) {
    process.exitCode = 1
  }
}

main()
