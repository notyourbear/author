import helpers from './functions'

describe('helper functions', () => {
  describe('articlize', () => {
    test('automatic returns an automatic', () => {
      expect(helpers.articlize('automatic')).toBe('an automatic')
    })
  })

  describe('between', () => {
    test('gets 1 if between is 1-1', () => {
      expect(helpers.between('1-1')).toEqual(1)
    })

    test('gets 0 if between is 0-0', () => {
      expect(helpers.between('0-0')).toEqual(0)
    })

    test('gets a num between 1 and 3 if between is 1-3', () => {
      const random = helpers.between('1-3')
      const check = random === 1 || random === 2 || random === 3
      expect(check).toBeTruthy()
    })
  })

  describe('capitalize', () => {
    test('returns capitalized word', () => {
      expect(helpers.capitalize('test')).toBe('Test')
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

  describe('modifier', () => {
    const fnHash = {
      capitalize: helpers.capitalize,
      possessive: helpers.possessive
    }

    test('uses no fnhashes', () => {
      const result = helpers.modifier('capitalize')()
      expect(result).toBe('')
    })

    test('should use both modifiers', () => {
      const result = helpers.modifier('capitalize|possessive', fnHash)('test')
      expect(result).toBe('Test\'s')
    })

    test('should spit out unchanged str if no modifier provided', () => {
      const result = helpers.modifier('', fnHash)('test')
      expect(result).toBe('test')
    })

    test('should not use modifiers if not in hash', () => {
      const result = helpers.modifier('capitalize|iDontExist', fnHash)('test')
      expect(result).toBe('Test')
    })
  })

  describe('pluralize', () => {
    test('return helper', () => {
      expect(helpers.pluralize('helper')).toBe('helpers')
    })

    test('return proofs', () => {
      expect(helpers.pluralize('proof')).toBe('proofs')
    })

    test('return knives', () => {
      expect(helpers.pluralize('knife')).toBe('knives')
    })
  })

  describe('possessive', () => {
    test('returns a possessive version of a string', () => {
      expect(helpers.possessive('test')).toBe('test\'s')
    })
  })

  describe('sample', () => {
    test('it returns input string', () => {
      expect(helpers.sample('hello')).toBe('hello')
    })

    test('it selects one of the possible selections', () => {
      const options = [1,2,3]
      const result = helpers.sample(options)

      expect((result === 1 || result === 2 || result === 3)).toBeTruthy()
    })

    test('it returns a deterministic answer', () => {
      const options = [1,2,3,4,5,6,7,8]
      const seed = 'my seed is my password'

      expect(helpers.sample(options, seed)).toBe(1)
    })
  })

  describe('uppercase', () => {
    test('returns an all caps version of a string', () => {
      expect(helpers.uppercase('test')).toBe('TEST')
    })
  })
})
