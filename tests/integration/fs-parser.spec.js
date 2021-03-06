const path = require('path')
const inspect = require('inspect.js')
const FirescriptParser = require('../../').FirescriptParser

const TEST_CASE_DIR = path.join(__dirname, '../fixtures/lang')

describe('FirescriptParser', () => {
  describe('parse', () => {
    const testCases = inspect.readDir(TEST_CASE_DIR)
    let group

    testCases.forEach((testCase) => {
      if (testCase.isDirectory()) {
        group = testCase.name

        it(`${group} into AST`, () => {
          const ast = require(`${testCase.path}/ast.json`)
          const source = inspect.readFile(`${testCase.path}/index.fire`)
          const parser = new FirescriptParser()
          const fsAST = parser.parse(source)
          inspect(fsAST).isObject()
          inspect(fsAST).isEql(ast)
        })
      }
    })
  })
})
