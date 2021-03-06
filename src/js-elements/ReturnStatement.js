const JSElement = require('./JSElement')

/**
 * ReturnStatement
 *
 * @class ReturnStatement
 * @extends JSElement
 *
 * interface ReturnStatement {
    type: 'ReturnStatement';
    argument: Expression | null;
}
*/
class ReturnStatement extends JSElement {
  constructor (ast) {
    super(ast)

    this.argument = ast.argument ? this.createElement(ast.argument) : null
  }

  toESString (ctx) {
    const arg = this.argument === null ? '' : this.argument.toESString(ctx)
    const argSpacing = arg ? ' ' : ''

    return this.renderElement(
      'return' +
      argSpacing +
      arg +
      ';'
    )
  }
}

module.exports = ReturnStatement
