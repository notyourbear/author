const helpers = require('./functions')

describe('helper functions', () => {
  describe('sample', () => {
    test('it returns input string', () => {
      expect(helpers.sample('hello')).toBe('hello')
    })

    test('it selects one of the possible selections', () => {
      const options = [1,2,3]
      const result = helpers.sample(options)

      expect((result === 1 || result === 2 || result === 3)).toBeTruthy()
    })
  })

  describe('checkIfAlreadyGenerated', () => {
    test('check equal objects -- returns true', () => {
      const obj1 = {
        type: 'person',
        name: 'testing'
      }
      const obj2 = Object.assign({}, obj1)

      expect(helpers.checkIfAlreadyGenerated(obj1, obj2)).toBeTruthy()
    })

    test('check different objects -- return false', () => {
      const obj1 = {
        type: 'person',
        name: 'testing'
      }
      const obj2 = Object.assign({}, obj1, {name: 'another'})

      expect(helpers.checkIfAlreadyGenerated(obj1, obj2, 1)).toBeFalsy()
    })
  })
})
