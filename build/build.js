#!/usr/bin/env node
'use strict'

const uglify = require('uglify-js')
const fs = require('fs')
const mkdirp = require('mkdirp')
const packer = require('regpack').packer
const path = require('path')

const srcPath = path.resolve(__dirname, '..', 'the.js')
const distDirPath = path.resolve(__dirname, '..', 'dist')
const distJsPath = path.resolve(distDirPath, 'submit.js')
const distShimPath = path.resolve(distDirPath, 'demo.html')
const shimTopPath = path.resolve(__dirname, 'shim-top.html')
const shimBottomPath = path.resolve(__dirname, 'shim-bottom.html')

function buildJs () {
  const src = uglify.minify(srcPath).code

  const packerResults = packer.runPacker(src, {
    withMath: false,
    hash2DContext: true,
    varsNotReassigned: []
  })

  const allOutputs = [src].concat(packerResults.reduce((result, data) => {
    return result.concat(data.result.map(r => r[1]))
  }, []))

  const shortestResult = allOutputs.reduce((result, output) => {
    if (output.length < result.length) {
      return output
    } else {
      return result
    }
  }, allOutputs[0])

  return shortestResult
}

function buildHtml (js) {
  return [
    fs.readFileSync(shimTopPath, { encoding: 'utf8' }),
    js,
    fs.readFileSync(shimBottomPath, { encoding: 'utf8' })
  ].join('')
}

mkdirp.sync(distDirPath)

const js = buildJs()
fs.writeFileSync(distJsPath, js)

fs.writeFileSync(distShimPath, buildHtml(js))

console.log(`output is ${js.length} characters`)
