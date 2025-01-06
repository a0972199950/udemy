// @ts-check

/**
 * @typedef {import('webpack').Compiler} Compiler
 * @typedef {import('webpack').Compilation} Compilation
 * @typedef {import('chalk').ChalkInstance} Chalk
 */

class LogBuildTimeWebpackPlugin {
  startTime = 0
  endTime = 0

  constructor() { }

  apply(/** @type Compiler */ compiler) {
    compiler.hooks.run.tap('LogBuildTimeWebpackPlugin', () => {
      this.startTime = Date.now()
    })

    compiler.hooks.done.tap('LogBuildTimeWebpackPlugin', () => {
      this.endTime = Date.now()
    })

    compiler.hooks.afterDone.tap('LogBuildTimeWebpackPlugin', async () => {
      if (compiler.watchMode) {
        return
      }

      const chalk = await (await import('chalk')).default
      console.log(chalk.green(`[Build time]: ${this.endTime - this.startTime}ms`))
    })
  }
}

module.exports = LogBuildTimeWebpackPlugin
