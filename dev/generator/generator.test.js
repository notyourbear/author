const Generator = require('./generator.js')

const schema = {
  model: {
    farmer: {
      name: ['Patrick', 'Joe', 'Hemmy', 'John'],
      title: ['farmer', 'farm-hand']
    }
  },
  entry: '::farmer.name:: went with ::farmer.Head.name:: to ::!place::',
  grammar: {
    place: 'the ::farmer.Head.title::\'s favorite the market'
  }
}

describe('generator', () => {
  test('it works', () => {
    var a = Generator(schema)
    console.log(a)
    expect(a).toBe(true)
  })
})
