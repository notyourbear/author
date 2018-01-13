const parser = require('./parser')

describe('Parser', () => {

  test('it returns one parsable item, not locked', () => {
    const grammar = "the quick brown ::animal.mammal:: jumps."
    const test = parser(grammar)
    const expected = {
      model: 'animal',
      property: 'mammal'
    }
    
    expect(test).toContainEqual(expected)
  })

  test('it returns one parsable item, locked with modifier', () => {
    const grammar = "the quick brown ::animal.subject.mammal|capitalize:: jumps."
    const test = parser(grammar)
    const expected = {
      model: 'animal',
      property: 'mammal',
      character: 'subject',
      modifier: 'capitalize'
    }
    
    expect(test).toContainEqual(expected)
  })

  test('it returns two parsable items, one locked, one not locked', () => {
    const grammar = "the quick brown ::animal.mammal:: jumps. the quick red ::animal.subject.mammal:: jumps."
    const test = parser(grammar)
    const expectedNotLocked = {
      model: 'animal',
      property: 'mammal'
    }
    const expectedLocked = {
      model: 'animal',
      property: 'mammal',
      character: 'subject'
    }

    expect(test).toContainEqual(expectedNotLocked)
    expect(test).toContainEqual(expectedLocked)
  })
})
