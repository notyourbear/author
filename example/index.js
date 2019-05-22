const Deutung = require("../dist/Deutung.js");
const model = require("./model.js");
const grammar = require("./grammar.js");

const schema = {
  model,
  grammar
};

const g = new Deutung.default({ schema: schema });
g.setEntry({ name: "entry" });

console.log(g.run());
