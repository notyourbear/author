var Deutung = require('../index.js');

const schema = {
  model: {
    farmer: {
      name: ['Patrick', 'Jordan', 'Miles', "Marko"],
      title: ['farmer'],
    }
  }
}

const entry = 'farmer.name|capitalize::, who was |between:18-43:: years old, went with farmer.Head.name:: to the market.';

const g = new Deutung({entry: entry, schema: schema});
let result = g.run();

console.log(result)
