const Model = require('./model')

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
  })
})
