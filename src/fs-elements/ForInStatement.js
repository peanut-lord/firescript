const FireScriptElement = require('./FireScriptElement')

/**
 * ForInStatement
 *
 * @class ForInStatement
 * @extends FireScriptElement
 *
 * interface ForInStatement {
 *   type: 'ForInStatement';
 *   left: Expression;
 *   right: Expression;
 *   body: Statement;
 * }
 */
class ForInStatement extends FireScriptElement {
  constructor (ast) {
    super(ast)

    this.left = this.createElement(ast.left)
    this.right = this.createElement(ast.right)
    this.body = this.createElement(ast.body)
  }

  toFSString (ctx) {
    return this.renderElement('for ' +
      this.left.toFSString(ctx) +
      ' in ' +
      this.right.toFSString(ctx) +
      this.body.toFSString(ctx)
    )
  }
}

module.exports = ForInStatement
