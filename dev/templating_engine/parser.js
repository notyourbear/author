// need to still deal with multiple modifiers

const parser = grammar => {
  const regex = /::\.|[^ ]*::/g
  const variables = grammar.match(regex)
  let modifier = false;

  const models = variables.map(variable => {
    let props = variable.slice(2, -2).split('.');
    const last = props[props.length - 1];
    const propertyAndModifier = last.split('|');
    if (propertyAndModifier.length === 2) modifier = true;
    return props.slice(0, -1).concat(propertyAndModifier)
  })

  return models.map(m => {
    let keys;
    if (modifier) {
      keys = m.length === 4 ?
        ['model', 'character', 'property', 'modifier'] : ['model', 'property', 'modifier'];
    } else {
      keys = m.length === 3 ?
        ['model', 'character', 'property'] : ['model', 'property'];
    }


    return keys.reduce((model, key, index) => {
      if (m[index]) model[key] = m[index]
      return Object.assign({}, model)
    }, {})
  })
}

module.exports = parser
