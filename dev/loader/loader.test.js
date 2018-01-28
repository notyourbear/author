const loader = require('./loader.js')

describe('generator', () => {
  test('it works', () => {
    const gened = Generator("test.json")
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
