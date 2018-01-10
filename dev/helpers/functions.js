const pluralise = require('pluralize')

const functions = {}

const between = str => {
  const options = str.split('-').map(Number)
  return getRandomInt(options[0], options[1])
}

const capitalize = str => str[0].toUpperCase() + str.slice(1)

const checkIfAlreadyGenerated = (model1, model2, simsAllowed = 0) => {
  const similarities = Object.keys(model1).reduce((sims, key) => {
    if (key === 'type') return sims
    return model1[key] === model2[key] ? sims += 1 : sims
  }, 0)

  return similarities >= simsAllowed
}

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}

const modifier = (str, fnHash = {}) => {
  const fns = str.split('|')

  const pipe = (input, fnArray) => {
    const modified =
      fnHash[fnArray[0]] ? fnHash[fnArray[0]].call(null, input) : input
    return fnArray.length === 1 ? modified : pipe(modified, fnArray.slice(1))
  }

  return (input = '') => pipe(input, fns)
}

const pluralize = str => pluralise(str)

const possessive = str => `${str}'s`

const sample = collection => {
  if (typeof collection === 'string') return collection
  const index = getRandomInt(0, collection.length)
  return collection[index]
}

const uppercase = str => str.toUpperCase()

module.exports = {
  between,
  capitalize,
  checkIfAlreadyGenerated,
  modifier,
  pluralize,
  possessive,
  sample,
  uppercase
}
