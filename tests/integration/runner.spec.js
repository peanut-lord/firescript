const path = require('path')
const inspect = require('inspect.js')
const SuperFS = require('superfs')
const FirescriptTokenizer = require('../../').FirescriptTokenizer
const FirescriptParser = require('../../').FirescriptParser
const FirescriptTranspiler = require('../../').FirescriptTranspiler
const JSParser = require('../../').JSParser

const TEST_CASE_DIR = path.join(__dirname, '../fixtures/')
const steps = inspect.readDir(TEST_CASE_DIR)

describe.skip('Integrtion test runner', () => {
  steps.forEach((step) => {
    if (!step.isDirectory() || !step.name.startsWith('step')) {
      return
    }

    describe(`${step.name}`, () => {
      const testCases = inspect.readDir(step.path)
      let group

      testCases.forEach((testCase) => {
        if (testCase.isDirectory()) {
          group = testCase.name
        }

        describe(`of ${group}`, () => {
          let jsAST
          let fsAST
          let fsSource
          let fsToken

          it(`Parse AST from JS`, () => {
            const source = inspect.readFile(path.join(testCase.path, 'index.js'))
            const parser = new JSParser()
            jsAST = parser.parse(source)
            inspect(jsAST).isObject()
          })

          it(`Transpile AST into FS`, () => {
            const transpiler = new FirescriptTranspiler()
            fsSource = transpiler.transpile(jsAST)
            inspect(fsSource).isString()
          })

          it('Inspect transpiled FS source', () => {
            const expected = inspect.readFile(path.join(testCase.path, 'index.fire'))
            inspect(fsSource).isEql(expected)
          })

          it(`Tokenize FS`, () => {
            const parser = new FirescriptTokenizer()
            fsToken = parser.tokenize(fsSource)
            inspect(fsToken).isArray()
          })

          it('Inspect token array', () => {
            const expected = require(path.join(testCase.path, 'token.json'))
            inspect(fsToken).isEql(expected)
          })

          it(`Transpile FS into AST`, () => {
            const parser = new FirescriptParser()
            fsAST = parser.parse(fsSource)
            inspect(fsAST).isObject()
          })

          it('Inspect transpiled FS AST', () => {
            inspect(fsAST).isEql(jsAST)
          })

          it(`Transpile FS-AST into JS`, () => {
            const parser = new FirescriptParser()
            fsAST = parser.parse(fsSource)
            inspect(fsAST).isObject()
          })

          it('Inspect transpiled JS', () => {
            inspect(fsAST).isEql(jsAST)
          })
        })
      })
    })
  })
})
