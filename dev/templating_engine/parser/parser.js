const keysOpts = {
  modCha: ['model', 'character', 'property', 'modifier'],
  mod: ['model', 'property', 'modifier'],
  cha: ['model', 'character', 'property'],
  gen: ['model', 'property']
}

const parser = grammar => {
  const regex = /::\.|[^ ]*::/g
  const variables = grammar.match(regex)

  const models = variables.map(variable => {
    let props = variable.slice(2, -2).split('.')

    if (props.length === 1 && props[0][0] === ">") {
      return props[0].slice(1).split(':').concat('helper');
    }

    const last = props[props.length - 1]
    const propertyAndModifiers = last.split('|')
    if (propertyAndModifiers.length >= 2) modifier = true
    const property = propertyAndModifiers[0]
    const modifiers = propertyAndModifiers.slice(1)

    let final = props.slice(0, -1).concat(property)
    if (modifiers.length > 0) {
      final.push(modifiers)
      final.push('modifier')
    }
    return final
  })

  return models.map(m => {
    const last = m[m.length - 1]

    if (last === 'helper') {
      const [helper, input] = m

      return {
        helper,
        input
      }
    }

    let keys
    if (last === 'modifier') {
      keys = m.length === 5 ? keysOpts.modCha : keysOpts.mod
    } else {
      keys = m.length === 3 ? keysOpts.cha : keysOpts.gen
    }

    return keys.reduce((model, key, index) => {
      if (m[index]) model[key] = m[index]
      return Object.assign({}, model)
    }, {})
  })
}

module.exports = parser
