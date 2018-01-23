const Model = require('./model/model.js')
const checkIfAlreadyGenerated = required('../helpers/functions').checkIfAlreadyGenerated

const Generator = (jsonSchema, state = {}) => {
  const schema = JSON.parse(jsonSchema)
  const models = schema.model;
  const grammars = schema.grammar;


  // read entry
  // parse / generate grammar
  // check state
  // generate state if necessary
  // generate statement from grammar

}



/**
schema should be what...
model: {
  [ {}]
}
grammar {}
entry: {}

so; the entry point gets read;
entry points to a grammar;
grammar, when coming across a model,
  checks if it exists in state and uses it,
  otherwise generates one and adds it to state;
  person.type.one
  person.type
**/
