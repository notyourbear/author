const Compiler = require('../compiler/compiler.js')
const helpers = require('../helpers/functions.js')
const Model = require('../model/model.js')
const Parser = require('../parser/parser.js')
const loader = require('../loader/loader.js')

const Generator = (jsonSchemaLocation, state = {}) => {
  const schema = loader(jsonSchemaLocation)
  const grammars = schema.grammar
  const { expandedGrammar, toModel } = Parser(schema.entry, grammars)

  const models = toModel.map(model => {
    let character;
    if (model.character) {
      character = state[model.character] || Model(schema.model[model.model], helpers)
      state[model.character] = character
    }
    character =  Model(schema.model[model.model], helpers)
    return character[model.property]
  })

  const compiled = Compiler(expandedGrammar, models)
  return { compiled, state };
}

module.exports = Generator;
