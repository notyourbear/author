// --------------------------------------------------------------
const modeler = toParseArray => {
  const modelerOptions = {
    modCha: ['model', 'character', 'property', 'modifier'],
    mod: ['model', 'property', 'modifier'],
    cha: ['model', 'character', 'property'],
    gen: ['model', 'property']
  }

  return toParseArray.map(model => {
    if (model.type === 'helper' || model.type === 'grammar') return model

    let keys
    if (model.type === 'modifiedModel') {
      keys = model.toParse.length === 4 ? modelerOptions.modCha : modelerOptions.mod
    } else {
      keys = model.toParse.length === 3 ? modelerOptions.cha : modelerOptions.gen
    }

    return keys.reduce((result, key, index) => {
      result[key] = model.toParse[index]
      return Object.assign({}, result, {type: 'model'})
    }, {})
  })
}
// --------------------------------------------------------------
const regexer = grammar => {
  const regex = /::\.|[^ ]*::/g
  const result = grammar.match(regex)
  return result === null ? [] : result
}
// --------------------------------------------------------------
const propType = props => {
  switch (true) {
  case props[0][0] === '|': return 'helper'
  case props[0][0] === '!': return 'grammar'
  case props[props.length - 1].includes('|'): return 'modifiedModel'
  default: return 'model'
  }
}
// --------------------------------------------------------------
const parser = regexArray => {
  const returnValue = (type, toParse) => {
    switch (type) {
    case 'helper': return { type, helper: toParse[0], input: toParse[1] }
    case 'grammar': return { type, grammar: toParse[0] }
    default: return { type, toParse }
    }
  }

  return regexArray.map(item => {
    const props = item.slice(2, -2).split('.')
    const type = propType(props)
    if (type === 'helper') return returnValue(type, props[0].slice(1).split(':'))
    if (type === 'grammar') {
      var option = [props[0].slice(1), ...props.slice(1)].join('.')
      return returnValue(type, [option])
    }
    const [property, ...modifiers] = props.pop().split('|')
    if (type === 'modifiedModel') return returnValue(type, props.concat(property, [modifiers]))
    return returnValue(type, props.concat(property))
  })
}
// --------------------------------------------------------------
const grammarExpander = (entry, grammars = {}) => {
  const regex = /::\.|[^ ]*::/g

  return entry.replace(regex, match => {
    if (match[2] !== '!') return match

    const grammar = match.slice(3, -2).split('.')

    const result = grammar.reduce((result, pointer) => {
      return result[pointer] ? result[pointer] : new Error(`The grammar: ${grammar} does not appear to exist`)
    }, grammars)

    if (result instanceof Error) return result
    return result.match(regex) === null ? result : grammarExpander(result, grammars)
  })
}

export default {
  grammarExpander,
  modeler,
  parser,
  propType,
  regexer,
}
