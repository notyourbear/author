const Deutung = require('../index.js');

const schema = {
  model: {
    farmer: {
      name: ['Patrick', 'Jordan'],
      title: ['farmer'],
      age: '|between:18-43'
    }
  },
  entry: '::farmer.name|capitalize::, who was ::farmer.age:: years old, went with ::farmer.Head.name:: to the market.',
}

const gened = Deutung(schema)
console.log(gened)
