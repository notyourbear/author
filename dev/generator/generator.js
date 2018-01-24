const Model = require('../model/model.js')
const Parser = require('../parser/parser.js')
const Compiler = require('../compiler/compiler.js')

const helpers = required('../helpers/functions')

const Generator = (schema, state = {}) => {
  // const schema = JSON.parse(jsonSchema)
  const grammars = schema.grammar
  const models = Object.keys(schema.model).reduce((state, key) => {
    state[key] = Model(schema.model[key], helpers)
  }, {})

  console.log({models})
  // read entry
  // parse / generate grammar
  // check state
  // generate state if necessary
  // generate statement from grammar
  const parsed = Parser(schema.entry, grammars)
  return models;
}



/**
schema should be what...
model: {
  [ {}]
}
grammar {}
entry: {}

so step one i think will be to rewrite parser to be... easier to append info
that said, what's next:
1. parses all models and creates state
2. read's entry
3. create array of things to compile from entry
4. runs through array and compiles or parses as necessary
  - the issue with this:
    i need to generate the text as i parse. or rather unpack it into
    a larger string that i then entirely compile. or compile in batches.
    i could stream it. i suppose.
    version one: one gigantic string.
5. replace as needed

so how do i do this. i need update the parser, first of all:
it shouldnt just be a function it should be a factory
  - the factory will have many things:
    -
**/

module.exports = Generator;
