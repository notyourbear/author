import loader from './loader.js';

describe('loader', () => {
  test('it works', () => {
    const specs = loader('dev/loader');
    const expected = {
      model:
         {
           farmer: { name: ['Patrick'], title: ['farmer'] },
           plower: { name: 'Mitchell', title: 'Plower' }
         },
      grammar:
         { place:
            [ 'the ::farmer.Head.title::\'s favorite market',
              'the ::plower.Head.title::\'s favorite market' ]
         },
      entry: '::farmer.name:: went with ::farmer.Head.name:: to ::!place::'
    };
    expect(specs).toMatchObject(expected);
  });
});
