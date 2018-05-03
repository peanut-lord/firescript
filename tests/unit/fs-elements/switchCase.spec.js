const inspect = require('inspect.js')
const SwitchCase = require('../../../src/fs-elements/SwitchCase')
const RenderContext = require('../../../src/RenderContext')

describe.skip('FireScriptElements', () => {
  describe('SwitchCase', () => {
    it('renders a SwitchCase element', () => {
      const ast = require('../../fixtures/ast/switchCase.json')
      const ctx = new RenderContext(null, 'fire')

      const jse = new SwitchCase(ast)
      inspect(jse.toFSString(ctx)).isEql(
        'case obj:\n' +
        '  one();\n' +
        '  break;'
      )
    })
  })
})
