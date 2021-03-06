const FirescriptElement = require('./FirescriptElement')

/**
 * TryStatement
 *
 * @class TryStatement
 * @extends FirescriptElement
 *
 * interface TryStatement {
 *   type: 'TryStatement';
 *   block: BlockStatement;
 *   handler: CatchClause | null;
 *   finalizer: BlockStatement | null;
 * }
 */
class TryStatement extends FirescriptElement {
  constructor (ast) {
    super(ast)

    this.block = this.createElement(ast.block)
    this.handler = ast.handler ? this.createElement(ast.handler) : null
    this.finalizer = ast.finalizer ? this.createElement(ast.finalizer) : null
  }

  toFSString (ctx) {
    const finalizer = this.finalizer ? this.finalizer.toFSString(ctx) : ''

    return this.renderElement(
      'try' +
      this.block.toFSString(ctx) +
      this.handler.toFSString(ctx) +
      finalizer
    )
  }
}

module.exports = TryStatement
