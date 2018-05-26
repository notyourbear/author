import Generator from './generator.js';

describe('Generator', () => {
  // test('init without variables', () => {
  //   let gen = new Generator();
  // });
  describe('Generator.add', () => {
    test('add a model', () => {
      let toAdd = {
        name: 'farmer',
        value: {
          name: ['Patrick', 'Benjamin', 'Joe', 'Bill', 'Channing']
        }
      };
      let gen = new Generator();
      gen.add({type: 'model', data: toAdd});
      let result = {
        farmer: {
          name: ['Patrick', 'Benjamin', 'Joe', 'Bill', 'Channing']
        }
      };

      expect(gen.schema.model).toMatchObject(result);
    });

    test('add a grammar', () => {
      let grammar = {
        name: 'place',
        value: 'farmer.Head.name::\'s market'
      };
      let gen = new Generator();
      gen.add({type: 'grammar', data: grammar});

      expect(gen.schema.grammar).toMatchObject({place: grammar.value});
    });
  });

  describe('Generator.setEntry', () => {
    test('with new value', () => {
      let val = 'farmer.name:: went with farmer.Head.name:: to !place::';
      let gen = new Generator();
      gen.setEntry({ value: val });
      expect(gen.entry).toEqual(val);
    });

    test('via pointer to grammar (name)', () => {
      let gen = new Generator();
      let grammar = {
        name: 'place',
        value: 'farmer.Head.name::\'s market'
      };
      gen.add({type: 'grammar', data: grammar});
      gen.setEntry({ name: 'place'});
      expect(gen.entry).toEqual(grammar.value);
    });
  });

  describe('Generator.sample', () => {
    test('without seed', () => {
      let arr = [1,2,3];
      let gen = new Generator();
      let result = gen.sample({collection: arr});
      let isCorrect = result === 1 || result === 2 || result === 3;
      expect(isCorrect).toBe(true);
    });

    test('with seed', () => {
      let arr = [1,2,3];
      let gen = new Generator();
      let result = gen.sample({collection: arr, seed: 'this is a seed'});
      expect(result).toEqual(1);
    });
  });

  describe('Generator.run', () => {
    describe('without provided seed', () => {
      let gen = new Generator();
      let model = {
        name: 'farmer',
        value: {
          name: ['Patrick', 'Benjamin', 'Joe']
        }
      };
      let grammar = {
        name: 'place',
        value: 'farmer.Head.name::\'s market'
      };

      gen.setEntry({value:  'farmer.name:: went with farmer.Head.name:: to !place::' });
      gen.add({type: 'model', data: model});
      gen.add({type: 'grammar', data: grammar});

      let result = gen.run();

      let possibleResults = [];
      model.value.name.forEach(name1 => {
        model.value.name.forEach(name2 => {
          possibleResults.push(`${name1} went with ${name2} to ${name2}'s market`);
        });
      });
      expect(possibleResults.includes(result)).toBe(true);
    });

    describe('with provided seed', () => {
      let gen = new Generator();
      let model = {
        name: 'farmer',
        value: {
          name: ['Patrick', 'Benjamin', 'Joe', 'Bill', 'Chris']
        }
      };
      let grammar = {
        name: 'place',
        value: 'farmer.Head.name::\'s market'
      };

      gen.setEntry({value:  'farmer.name:: went with farmer.Head.name:: to !place::' });
      gen.add({type: 'model', data: model});
      gen.add({type: 'grammar', data: grammar});
      gen.seed = 'this is a seed for a name';

      let result = gen.run({randomizeSchemaSelections: true});

      expect(result).toBe('Patrick went with Benjamin to Benjamin\'s market');
    });
  });

  describe('Generator.getState', () => {
    let gen = new Generator({seed: 'a stately seed'});
    let model = {
      name: 'farmer',
      value: {
        name: ['Patrick', 'Benjamin', 'Joe', 'Bill', 'Chris']
      }
    };
    let grammar = {
      name: 'place',
      value: 'farmer.Head.name::\'s market'
    };

    gen.add({type: 'model', data: model});
    gen.add({type: 'grammar', data: grammar});
    gen.setEntry({value:  'farmer.name:: went with farmer.Head.name:: to !place::' });
    gen.run();
    let state = gen.getState();
    expect(state).toMatchObject({'farmer': {'Head': {'name': 'Patrick'}}});
  });


  //
  // test('it works using json', () => {
  //   const gened = Generator('dev/generator')
  //   const expected = {
  //     compiled: 'Patrick went with Patrick to the farmer\'s favorite market, which was built in 1999.',
  //     state: {
  //       Head: {
  //         name: 'Patrick',
  //         title: 'farmer'
  //       }
  //     }
  //   }
  //   expect(gened.compiled).toBe(expected.compiled)
  //   expect(gened.state).toMatchObject(expected.state)
  // })

  // test('it works using json state', () => {
  //   const gened = Generator('dev/generator', { state: 'dev/generator/state'})
  //   const expected = {
  //     compiled: 'Patrick went with Patrick to the farmer\'s favorite market, which was built in 1999.',
  //     state: {
  //       Head: {
  //         name: 'Patrick',
  //         title: 'farmer'
  //       }
  //     }
  //   }
  //   expect(gened.compiled).toBe(expected.compiled)
  //   expect(gened.state).toMatchObject(expected.state)
  // })
  //
  // test('it works using js', () => {
  //   const schema = {
  //     model: {
  //       farmer: {
  //         name: ['Patrick'],
  //         title: ['farmer']
  //       }
  //     },
  //     entry: '::farmer.name:: went with ::farmer.Head.name:: to ::!place::',
  //     grammar: {
  //       place: 'the ::farmer.Head.title::\'s favorite market, which was built in ::|between:1999-1999::.'
  //     }
  //   }
  //
  //   const state = {
  //     Title: {
  //       name: 'Goose',
  //       title: 'wingman'
  //     }
  //   }
  //
  //   const gened = Generator(schema, {state})
  //   const expected = {
  //     compiled: 'Patrick went with Patrick to the farmer\'s favorite market, which was built in 1999.',
  //     state: {
  //       Head: {
  //         name: 'Patrick',
  //         title: 'farmer'
  //       },
  //       Title: {
  //         name: 'Goose',
  //         title: 'wingman'
  //       }
  //     }
  //   }
  //   expect(gened.compiled).toBe(expected.compiled)
  //   expect(gened.state).toMatchObject(expected.state)
  // })
  //
  // test('it works with a provided modifier', () => {
  //   const startsWithS = string => {
  //     return `s${string.slice(1)}`
  //   }
  //
  //   const schema = {
  //     model: {
  //       farmer: {
  //         name: ['Patrick'],
  //         title: ['farmer'],
  //         age: '|between:18-18'
  //       }
  //     },
  //     entry: '::farmer.name|startsWithS|capitalize::, who was ::farmer.age:: years old, went with ::farmer.Head.name:: to the market.',
  //   }
  //
  //   const options = {
  //     modifiers: { startsWithS }
  //   }
  //
  //   const gened = Generator(schema, options)
  //   const expected = {
  //     compiled: 'Satrick, who was 18 years old, went with Patrick to the market.',
  //     state: {
  //       Head: {
  //         name: 'Patrick',
  //         title: 'farmer'
  //       }
  //     }
  //   }
  //   expect(gened.compiled).toBe(expected.compiled)
  //   expect(gened.state).toMatchObject(expected.state)
  // })
});
