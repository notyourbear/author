let Deutung = require('../index.js');
let model = require('./model.js');
let grammar = require('./grammar.js');

const schema = {
  model,
  grammar
}

let g = new Deutung({schema: schema});
g.setEntry({name: 'entry'});

console.log(g.run());
