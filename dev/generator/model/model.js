//creates the subject models;
const sample = require('../../helpers/functions').sample

const Model = (schema, fnHash = {}) => {
  const keys = Object.keys(schema);
  const state = keys.reduce((state, key) => {
  	if (schema[key][0] === ':' && schema[key][1] === ';') {
      const [fn, input] = schema[key].slice(2).split(':<')
    	state[key] = fnHash[fn] ? fnHash[fn].call(null, input) : schema[key]
  	} else {
    	state[key] =  sample(schema[key])
  	}
  	return state
  }, {})

  return state
}

module.exports = Model;
