var Deutung = require('../index.js');
console.log(Deutung)

const schema = {
  model: {
    farmer: {
      name: ['Patrick', 'Jordan'],
      title: ['farmer'],
      age: '|between:18-43'
    }
  },
  entry: 'farmer.name|capitalize::, who was farmer.age:: years old, went with farmer.Head.name:: to the market.',
}

const g = new Deutung(schema);
let result = g.run();

console.log(result)
