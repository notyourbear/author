import Compiler from '../compiler/compiler.js'
import helpers from '../helpers/functions.js'
import Model from '../model/model.js'
import Parser from '../parser/parser.js'
import loader from '../loader/loader.js'

const Generator = (jsonSchemaLocation, options = {}) => {
  const seed = options.seed
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

    let character = state[model.character] || Model(schema.model[model.model], modifiers, seed)
    if (model.character) state[model.character] = character

    let property = character[model.property]

    if (model.modifier) {
      property = model.modifier.reduce((result, modifier) => {
        const modifierFn = modifiers[modifier]
        return modifierFn(result, seed)
      }, property)
    }

    return property
  })

  const compiled = Compiler(expandedGrammar, models)
  return { compiled, state }
}

module.exports = Generator
