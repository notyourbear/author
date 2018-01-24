const fns = require('./functions.js')

const {
  grammarExpander,
  regexer,
  parser,
  modeler
} = fns

const Parser = (entry, grammars) => {
  const expandedGrammar = grammarExpander(entry, grammars)
  let toModel = regexer(expandedGrammar)
  toModel = parser(toModel)
  toModel = modeler(toModel)

  return {
	toModel,
	expandedGrammar
  }
}


module.exports = Parser;
