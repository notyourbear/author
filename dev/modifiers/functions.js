import pluralise from 'pluralize';
import seedrandom from 'seedrandom';
import Articles from 'articles';

const articlize = (string) => Articles.articlize(string);

const between = (str, seed) => {
  const options = str.split('-').map(Number);
  return getRandomInt(options[0], options[1], seed);
};

const capitalize = str => str[0].toUpperCase() + str.slice(1);

const checkIfAlreadyGenerated = (model1, model2, simsAllowed = 0) => {
  const similarities = Object.keys(model1).reduce((sims, key) => {
    if (key === 'type') return sims;
    return model1[key] === model2[key] ? sims += 1 : sims;
  }, 0);

  return similarities >= simsAllowed;
};

const getRandomInt = (min, max, seed) => {
  const rng = seed ? seedrandom(seed) : seedrandom();
  return Math.floor(rng() * (max - min)) + min;
};

const modifier = (str, fnHash = {}) => {
  const fns = str.split('|');

  const pipe = (input, fnArray) => {
    const modified =
      fnHash[fnArray[0]] ? fnHash[fnArray[0]].call(null, input) : input;
    return fnArray.length === 1 ? modified : pipe(modified, fnArray.slice(1));
  };

  return (input = '') => pipe(input, fns);
};

const pluralize = str => pluralise(str);

const possessive = str => `${str}'s`;

const sample = (collection, seed) => {
  if (typeof collection === 'string') return collection;
  const index = getRandomInt(0, collection.length, seed);
  return collection[index];
};

const uppercase = str => str.toUpperCase();

export default {
  articlize,
  between,
  capitalize,
  checkIfAlreadyGenerated,
  modifier,
  pluralize,
  possessive,
  sample,
  uppercase
};
