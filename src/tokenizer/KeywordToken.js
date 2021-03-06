const Token = require('./Token')
const IdentifierToken = require('./IdentifierToken')

class KeywordToken extends Token {
  constructor (parent, value) {
    super(parent, value)
    this.type = 'keyword'
  }

  tokenize (match) {
    console.log('KMATCH', match)
    if (match.identifier) {
      const token = new IdentifierToken(this, match.identifier)

      return token
    }
  }
}

module.exports = KeywordToken
