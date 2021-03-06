const JSElement = require('./JSElement')

/**
 * MetaProperty
 *
 * @class MetaProperty
 * @extends JSElement
 *
 * interface MetaProperty {
 *   type: 'MetaProperty';
 *   meta: Identifier;
 *   property: Identifier;
 * }
 */
class MetaProperty extends JSElement {
  constructor (ast) {
    super(ast)

    this.meta = this.createElement(ast.meta)
    this.property = this.createElement(ast.property)
  }

  toESString (ctx) {
    return this.renderElement(
      this.meta.toESString(ctx) +
      '.' +
      this.property.toESString(ctx)
    )
  }
}

module.exports = MetaProperty
