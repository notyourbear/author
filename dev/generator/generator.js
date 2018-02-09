const Compiler = require('../compiler/compiler.js')
const helpers = require('../helpers/functions.js')
const Model = require('../model/model.js')
const Parser = require('../parser/parser.js')
const loader = require('../loader/loader.js')

const Generator = (jsonSchemaLocation, options = {}) => {
  let state = options.state ? options.state : {}
  let modifiers = options.modifiers ? options.modifiers : {}

  const schema = typeof jsonSchemaLocation === 'string' ? loader(jsonSchemaLocation) : jsonSchemaLocation
  state = typeof state === 'string' ? loader(state) : state

  modifiers = Object.assign({}, helpers, modifiers)
  const grammars = schema.grammar
  const { expandedGrammar, toModel } = Parser(schema.entry, grammars)

  const models = toModel.map(model => {
    if (model.type === 'helper') {
      return modifiers[model.helper](model.input)
    }

    let character = state[model.character] || Model(schema.model[model.model], modifiers)
    state[model.character] = character

    let property = character[model.property]
    if (model.modifier) {
      property = model.modifier.reduce((result, modifier) => {
        const modifierFn = modifiers[modifier]
        return modifierFn(result)
      }, property)
    }

    return property;
  })

  const compiled = Compiler(expandedGrammar, models)

  return { compiled, state }
}

module.exports = Generator
