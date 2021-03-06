const inspect = require('inspect.js')
const JSParser = require('../../src/JSParser')

const helloWorldJS =
  'import print from \'print\'\n' +
  'print(\'Hello World!\')\n'

const helloWorldAST = require('../fixtures/helloWorldAST.json')

describe('JSParser', () => {
  describe('parse()', () => {
    it('Parse a .js into AST', () => {
      const Firescript = new JSParser()
      const ast = Firescript.parse(helloWorldJS)
      inspect(ast).isObject()
      inspect(ast).isEql(helloWorldAST)
    })
  })
})
