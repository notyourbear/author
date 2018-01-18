const parser = require('./parser')

describe('parser', () => {
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
      modifier: ['capitalize']
    }

    expect(test).toContainEqual(expected)
  })

  test('it returns one parsable item, unlocked with two modifiers', () => {
    const grammar = "the quick brown ::animal.mammal|capitalize|pluralize:: jump."
    const test = parser(grammar)
    const expected = {
      model: 'animal',
      property: 'mammal',
      modifier: ['capitalize', 'pluralize']
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

  test('it returns a helper function', () => {
    const grammar = "the age of ::>number:20-50::"
    const test = parser(grammar)

    const expected = {
      helper: 'number',
      input: '20-50'
    }

    expect(test).toContainEqual(expected)
  })

  test('it returns a parsed item, non locked, and a helper function', () => {
    const grammar = "the age of ::human.name:: is ::>number:20-50::"
    const test = parser(grammar)

    const expectedHelper = {
      helper: 'number',
      input: '20-50'
    }

    const expectedParser = {
      model: 'human',
      property: 'name'
    }

    expect(test).toContainEqual(expectedHelper)
    expect(test).toContainEqual(expectedParser) 
  })
})
