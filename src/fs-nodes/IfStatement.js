const FirescriptNode = require('./FirescriptNode')

class IfStatement extends FirescriptNode {
  constructor (tokenStack, parent, test) {
    super(tokenStack, parent)

    if (tokenStack.expect('keyword', 'if')) {
      tokenStack.goForward()
      this.test = this.createFullNode(tokenStack)
    } else if (tokenStack.expect('keyword', 'elif')) {
      this.expectParent('IfStatement', tokenStack.current())

      tokenStack.goForward()
      this.test = this.createFullNode(tokenStack)
    } else {
      this.syntaxError('Unexpected token! If statement expected', tokenStack.current())
    }

    this.consequent = this.createFullNode(tokenStack)
    if (this.consequent.type === 'Null') {
      this.consequent = this.createBlockStatementNode(tokenStack)
    }

    if (tokenStack.expect('keyword', 'elif')) {
      this.alternate = this.createIfStatementNode(tokenStack, test)
    }

    if (tokenStack.expect('keyword', 'else')) {
      tokenStack.goForward()
      this.alternate = this.createFullNode(tokenStack)
    }
  }

  toJSON () {
    return this.createJSON({
      type: 'IfStatement',
      test: this.test.toJSON(),
      consequent: this.consequent.toJSON(),
      alternate: this.alternate ? this.alternate.toJSON() : null
    })
  }
}

module.exports = IfStatement
