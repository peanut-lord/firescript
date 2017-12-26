const inspect = require('inspect.js')

const helloWorldFS =
  'import print from \'print\'\n' +
  'print(\'Hello World!\')'

const FireScriptTranspiler = require('../../src/FireScriptTranspiler')
const helloWorldAST = require('../fixtures/helloWorldAST.json')

describe('FireScriptTranspiler', () => {
  describe('transpile()', () => {
    it('transpiles a AST to .fs', () => {
      const fireScript = new FireScriptTranspiler()
      const source = fireScript.transpile(helloWorldAST)
      inspect(source).isEql(helloWorldFS)
    })

    it('transpiles a AST to .fs, using elements', () => {
      const fireScript = new FireScriptTranspiler()
      const source = fireScript.transpile2(helloWorldAST)
      inspect(source).isEql(helloWorldFS)
    })
  })
})
