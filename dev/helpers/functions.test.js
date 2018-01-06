const helpers = require('./functions')

describe('helper functions', () => {
  describe('sample', () => {
    test('it returns input string', () => {
      expect(helpers.sample('hello')).toBe('hello')
    })

    test('it selects one of the possible selections', () => {
      const options = [1,2,3]
      const result = helpers.sample(options);

      expect((result === 1 || result === 2 || result === 3)).toBeTruthy();
    })
  })
})
