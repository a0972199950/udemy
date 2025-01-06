// @ts-check

/**
 * @typedef {import('webpack').Compiler} Compiler
 * @typedef {import('webpack').Compilation} Compilation
 */

const { sources } = require('webpack')

class AddCopyrightWebpackPlugin {
  constructor(options) {
    this.content = options.content || '© default copyright content'
  }

  apply(/** @type Compiler */ compiler) {
    compiler.hooks.emit.tapPromise('AddCopyrightWebpackPlugin', async (/** @type Compilation */ compilation) => {
      Object.keys(compilation.assets).forEach((filename) => {
        if (!filename.endsWith('.js')) {
          return
        }

        const originContent = compilation.assets[filename].source()
        const copyright = `// ${this.content}\n`
        compilation.assets[filename] = new sources.ConcatSource(
          copyright,
          Buffer.isBuffer(originContent) ? originContent.toString() : originContent
        )
      })
    })
  }
}

module.exports = AddCopyrightWebpackPlugin
