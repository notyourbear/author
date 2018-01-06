//creates the subject models;
const sample = require('../../helpers/functions').sample

const Model = schema => {
  const keys = Object.keys(schema);
  const state = keys.reduce((state, key) => {
    state[key] = sample(schema[key]);
    return state;
  }, {})

  return state;
}

module.exports = Model;
