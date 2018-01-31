const compiler = require('./compiler')

describe('compiler', () => {
  test('it returns a compiled item', () => {
    const grammar = 'the quick brown ::animal.mammal:: jumps.'
    const replacement = ['fox']

    const result = 'the quick brown fox jumps.'

    expect(compiler(grammar, replacement)).toBe(result)
  })

  test('it returns a compiled item', () => {
    const grammar = 'the quick brown ::animal.mammal:: jumps over the ::object::.'
    const replacement = ['fox', 'fence']

    const result = 'the quick brown fox jumps over the fence.'

    expect(compiler(grammar, replacement)).toBe(result)
  })
})
