const Generator = require('./generator.js')

const schema = {
  model: {
    farmer: {
      name: ['Patrick'],
      title: ['farmer']
    }
  },
  entry: '::farmer.name:: went with ::farmer.Head.name:: to ::!place::',
  grammar: {
    place: 'the ::farmer.Head.title::\'s favorite the market'
  }
}

describe('generator', () => {
  test('it works', () => {
    const gened = Generator("dev/generator")
    const expected = {
      compiled: "Patrick went with Patrick to the farmer's favorite the market",
      state: {
        Head: {
          name: "Patrick",
          title: "farmer"
        }
      }
    }
    expect(gened.compiled).toBe(expected.compiled)
    expect(gened.state).toMatchObject(expected.state)
  })
})
