const Model = require('./model')
const helpers = require('../helpers/functions');

describe('generator - Model', () => {
  describe('creates a model', () => {
    test('it should generate a simple model', () => {
      const test = {
        type: 'simple',
        name: 'test'
      }

      const model = Model(test)

      expect(model.type).toBe('simple')
      expect(model.name).toBe('test')
    })

    test('it should modify the model if given a modifier function', () => {
      const test = {
        yearOfRelease: ":;between:<1980-1980",
      }

      const hash = {
        between: helpers.between
      }

      const model = Model(test, hash)

      expect(model.yearOfRelease).toEqual(1980)
    })
  })
})
