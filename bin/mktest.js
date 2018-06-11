const path = require('path')
const SuperFS = require('superfs')
const superconf = require('superconf')
const colorfy = require('colorfy')
const defaultConf = require(path.join(__dirname, '../conf/defaultConf.json'))

const FireScriptTokenizer = require('../src/FireScriptTokenizer')
const FireScriptParser = require('../src/FireScriptParser')
const JSTranspiler = require('../src/JSTranspiler')

const TEST_CASE_PATH = path.join(__dirname, '../../firescript-test/syntax/')

const testFiles = [
  { file: 'index.fire', content: '', description: 'Firescript source' },
  { file: 'fstoken.json', content: '{}', description: 'Firescript tokenize result', isRewritable: true },
  { file: 'fsconf.json', content: '{}', description: 'Firescript parser config' },
  { file: 'fsast.json', content: '{}', description: 'Firescript parser result', isRewritable: true },
  { file: 'result.js', content: '', description: 'Firescript transpiler result', isRewritable: true }
]

async function createProject (ctx) {
  const conf = await ctx
    .ask({ name: 'title', question: 'Enter a testcase title' })
    .prompt()

  const testCaseDir = conf.title.replace(/\s+/g, '-').toLowerCase()

  const cf = colorfy()
  if (await SuperFS.exists(path.join(TEST_CASE_PATH, testCaseDir))) {
    cf.grey('Test case ').red(testCaseDir).grey(' already exists!').nl()
    throw new Error(cf.colorfy())
  } else {
    cf.grey('creating new test: ').lime(testCaseDir).nl()
  }

  for (const file of testFiles) {
    cf.grey('create file ').turq(file.file).ddgrey(` (${file.description}) `)
    await SuperFS.writeFile(path.join(TEST_CASE_PATH, testCaseDir, file.file), file.content)
    cf.lime('✔').nl()
  }

  cf.print()

  const sourceInput = await ctx
    .ask({ name: 'input', question: 'Do you want enter source file?', type: 'boolean' })
    .ask({ name: 'source', question: 'index.fire', type: 'input', only: (answers) => answers.input })
    .prompt()

  await SuperFS.writeFile(path.join(TEST_CASE_PATH, testCaseDir, 'index.fire'), sourceInput.source)

  return {
    testCaseDir
  }
}

async function rewriteProject (ctx) {
  const conf = await ctx
    .ask({ name: 'testcase', question: 'Enter test case to rewrite' })
    .prompt()

  const testCaseDir = conf.testcase.replace(/\s+/g, '-').toLowerCase()

  const cf = colorfy()
  for (const file of testFiles) {
    if (!file.isRewritable) {
      continue
    }

    cf.grey('rewrite file ').turq(file.file).ddgrey(` (${file.description}) `)
    await SuperFS.writeFile(path.join(TEST_CASE_PATH, testCaseDir, file.file), file.content)
    cf.lime('✔').nl()
  }

  cf.print()

  return {
    testCaseDir
  }
}

module.exports = (supershit) => {
  return supershit
    .cmd('mktest')
    .description('Create a Firescript syntax test case')
    .option('-r,--rewrire', 'Rewrite existing test case after code change')
    .action(async (ctx, name) => {
      if (!await SuperFS.exists(TEST_CASE_PATH)) {
        console.error('Firescript test repo not found! Please clone the firescript-test repo paralel to firescript repo')
        console.error('$ cd ../')
        console.error('$ git clone https://gitlab.noname-media.com/Firescript/firescript-test.git')
        return
      }

      const { testCaseDir } = ctx.rewrire ? await rewriteProject(ctx) : await createProject(ctx)
      const fileSource = await SuperFS.readFile(path.join(TEST_CASE_PATH, testCaseDir, 'index.fire'))

      if (fileSource) {
        const tokenizer = new FireScriptTokenizer()
        const tokenstack = tokenizer.tokenize(fileSource)
        await SuperFS.writeFile(path.join(TEST_CASE_PATH, testCaseDir, 'fstoken.json'), JSON.stringify(tokenstack, null, '  '))

        const parser = new FireScriptParser()
        const ast = parser.parse(fileSource)
        await SuperFS.writeFile(path.join(TEST_CASE_PATH, testCaseDir, 'fsast.json'), JSON.stringify(ast, null, '  '))

        const transpiler = new JSTranspiler()
        const result = transpiler.transpile(ast)
        await SuperFS.writeFile(path.join(TEST_CASE_PATH, testCaseDir, 'result.js'), result)
      }

      // -----------------------------------------------------------------------
      // const configFile = path.join(process.cwd(), '.firerc')fileSource
      // const conf = superconf.merge(defaultConf, superconf('fire') || {})

      // const res = await ctx
      //   .ask({ name: 'src', question: 'Enter source folder', default: conf.src })
      //   .ask({ name: 'dest', question: 'Enter destination folder', default: conf.dest })
      //   // .ask({ name: 'copy', question: 'Copy files to dest folder', default: conf.copy, type: 'array' })
      //   .ask({ name: 'esModules', question: 'ES7 modules enabled (y[es] n[o]?', default: conf.features.esModules ? 'yes' : 'no', type: 'boolean' })
      //   .ask({ name: 'esClasses', question: 'ES6 classes enabled (y[es] n[o]?', default: conf.features.esClasses ? 'yes' : 'no', type: 'boolean' })
      //   .prompt()
      //
      // console.log(res)

      // const prettyResult = JSON.stringify({
      //   src: res.src,
      //   dest: res.dest,
      //   copy: res.copy,
      //   features: {
      //     esModules: res.esModules,
      //     esClasses: res.esClasses
      //   }
      // }, null, '  ')
      //
      // cf.nl().txt('Write configuration to ').lgrey(configFile).nl()
      // cf.grey(prettyResult).print()
      //
      // await SuperFS.writeFile(configFile, prettyResult)
    })
}
