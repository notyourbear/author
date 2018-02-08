const Generator = require('./generator.js')

describe('generator', () => {
  test('it works using json', () => {
    const gened = Generator('dev/generator')
    const expected = {
      compiled: 'Patrick went with Patrick to the farmer\'s favorite market, which was built in 1999.',
      state: {
        Head: {
          name: 'Patrick',
          title: 'farmer'
        }
      }
    }
    expect(gened.compiled).toBe(expected.compiled)
    expect(gened.state).toMatchObject(expected.state)
  })

  test('it works using json state', () => {
    const gened = Generator('dev/generator', { state: 'dev/generator/state'})
    const expected = {
      compiled: 'Patrick went with Patrick to the farmer\'s favorite market, which was built in 1999.',
      state: {
        Head: {
          name: 'Patrick',
          title: 'farmer'
        }
      }
    }
    expect(gened.compiled).toBe(expected.compiled)
    expect(gened.state).toMatchObject(expected.state)
  })

  test('it works using js', () => {
    const schema = {
      model: {
        farmer: {
          name: ['Patrick'],
          title: ['farmer']
        }
      },
      entry: '::farmer.name:: went with ::farmer.Head.name:: to ::!place::',
      grammar: {
        place: 'the ::farmer.Head.title::\'s favorite market, which was built in ::>between:1999-1999::.'
      }
    }

    const state = {
      Title: {
        name: 'Goose',
        title: 'wingman'
      }
    }

    const gened = Generator(schema, {state})
    const expected = {
      compiled: 'Patrick went with Patrick to the farmer\'s favorite market, which was built in 1999.',
      state: {
        Head: {
          name: 'Patrick',
          title: 'farmer'
        },
        Title: {
          name: 'Goose',
          title: 'wingman'
        }
      }
    }
    expect(gened.compiled).toBe(expected.compiled)
    expect(gened.state).toMatchObject(expected.state)
  })
})
