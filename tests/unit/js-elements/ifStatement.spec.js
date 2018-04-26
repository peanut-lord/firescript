const inspect = require('inspect.js')
const IfStatement = require('../../../src/js-elements/IfStatement')
const RenderContext = require('../../../src/RenderContext')

describe('JSElements', () => {
  describe('IfStatement', () => {
    it('renders a IfStatement element', () => {
      const ast = require('../../fixtures/ast/ifStatement.json')
      const ctx = new RenderContext()

      const jse = new IfStatement(ast)
      inspect(jse.toESString(ctx)).isEql(
        'if (foo) {\n' +
        '  console.log(foo);\n' +
        '}'
      )
    })
  })
})