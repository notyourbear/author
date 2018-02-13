//creates the subject models
const sample = require('../helpers/functions').sample

const Model = (schema, fnHash = {}, seed) => {
  const keys = Object.keys(schema)
  return keys.reduce((state, key) => {
    if (schema[key][0] === '|') {
      const [fn, input] = schema[key].slice(1).split(':')
      state[key] = fnHash[fn] ? fnHash[fn](input, seed) : schema[key]
    } else {
      state[key] = sample(schema[key], seed)
    }

    return state
  }, {})
}

module.exports = Model
