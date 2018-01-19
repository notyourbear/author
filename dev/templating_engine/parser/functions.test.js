const parsingFns = require('./functions')
describe('parser functions', () => {
  describe('regexer', () => {
  	test('returns an array with one item', () => {
    	const grammar = "the quick brown ::animal.mammal:: jumps."
    	const test = parsingFns.regexer(grammar)
    	const expected = '::animal.mammal::'
    	expect(test).toContain(expected)
      expect(test).toHaveLength(1)
  	})
  	test('returns an array with two items', () => {
    	const grammar = "the quick brown ::animal.mammal:: jumps. the other one ::animal.reptile:: lies still."
    	const test = parsingFns.regexer(grammar)
    	const expected = '::animal.mammal::'
      const expected2 = '::animal.reptile::'
    	expect(test).toContain(expected)
      expect(test).toContain(expected2)
      expect(test).toHaveLength(2)
  	})
  	test('returns an array with zero items', () => {
    	const grammar = "the quick brown fox."
    	const test = parsingFns.regexer(grammar)
    	const expected = []
    	expect(test).toHaveLength(0)
  	})
  })
  describe('propType', () => {
  	test('returns propType: helper', () => {
    	const parse = ['>inBetween:1000-2000']
    	const test = parsingFns.propType(parse)
    	expect(test).toEqual('helper')
  	})
  	test('returns propType: grammar', () => {
    	const parse = ['!fishing.story']
    	const test = parsingFns.propType(parse)
    	expect(test).toEqual('grammar')
  	})
  	test('returns propType: modifiedModel', () => {
    	const parse = ['animal.mammal|capitalize']
    	const test = parsingFns.propType(parse)
    	expect(test).toEqual('modifiedModel')
  	})
  	test('returns propType: model', () => {
    	const parse = ['animal.mammal']
    	const test = parsingFns.propType(parse)
    	expect(test).toEqual('model')
  	})
  })
  describe('parser', () => {
  	const options = {
    	helper: '::>inBetween:1000-2000::',
    	grammar: '::!fishing.story::',
    	modifiedModel: '::animal.mammal|capitalize|possessive::',
    	model: '::animal.mammal::'
  	}

  	test('returns a helper, grammar, modifiedModel, model', () => {
    	const parse = [options.helper, options.grammar, options.modifiedModel, options.model]
    	const test = parsingFns.parser(parse);
    	const expectedHelper = { type: 'helper', helper: 'inBetween', input: '1000-2000'}
    	const expectedGrammar = { type: 'grammar', grammar: 'fishing.story' }
    	const expectedModel = { type: 'model', toParse: ['animal', 'mammal'] }
    	const expectedModifiedModel = { type: 'modifiedModel', toParse: ['animal', 'mammal', ['capitalize', 'possessive']] }
    	expect(test).toContainEqual(expectedHelper)
    	expect(test).toContainEqual(expectedGrammar)
    	expect(test).toContainEqual(expectedModel)
    	expect(test).toContainEqual(expectedModifiedModel)
  	})
  })
  describe('modeler', () => {
  	const options = {
    	grammar: 'fishing.story',
    	modifiedModel: 'animal.mammal|capitalize|possessive',
    	model: 'animal.mammal',
    	lockedModel: 'animal.subject.mammal',
    	lockedModifiedModel: 'animal.subject.mammal|capitalize',
  	}

  	test('returns a helper, grammar, modifiedModel, model, lockedModel, and lockedModifiedModel', () => {
      const parse = [
        { type: 'helper', helper: 'inBetween', input: '1000-2000'},
        { type: 'grammar', grammar: 'fishing.story' },
        { type: 'modifiedModel', toParse: ['animal', 'mammal', ['capitalize', 'possessive']] },
        { type: 'model', toParse: ['animal', 'mammal'] },
        { type: 'model', toParse: ['animal', 'subject', 'mammal'] },
        { type: 'modifiedModel', toParse: ['animal', 'subject', 'mammal', ['capitalize']] }
      ]
    	const test = parsingFns.modeler(parse);

      const expectedHelper = { type: 'helper', helper: 'inBetween', input: '1000-2000'}
    	const expectedGrammar = { type: 'grammar', grammar: 'fishing.story' }
    	const expectedModel = { type: 'model', model: 'animal', property: 'mammal' }
    	const expectedLockedModel = { type: 'model', model: 'animal', property: 'mammal', character: 'subject' }
    	const expectedModifiedModel = { type: 'model', model: 'animal', property: 'mammal', modifier: ['capitalize', 'possessive'] }
    	const expectedLockedModifiedModel = { type: 'model', model: 'animal', property: 'mammal', modifier: ['capitalize'], character: 'subject' }
    	expect(test).toContainEqual(expectedHelper)
    	expect(test).toContainEqual(expectedGrammar)
    	expect(test).toContainEqual(expectedModel)
    	expect(test).toContainEqual(expectedLockedModel)
    	expect(test).toContainEqual(expectedLockedModifiedModel)
    	expect(test).toContainEqual(expectedModifiedModel)
  	})
  })
})
