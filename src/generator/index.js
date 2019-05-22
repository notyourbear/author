import seedrandom from "seedrandom";
import modifiers from "../modifiers/functions.js";

function validateData(data) {
  return data.name !== undefined && data.value !== undefined;
}

/*
  may be constructed with the following options:
    seed: a seed to use for randomisaztion. If not provided, it will be truly random.
    state: an existing state made up of models. All may be provided later as well.
    modifiers: additional functions that can be used to parse and modify the variables during construction.
    entry: the entry point of the generative text.
    schema: schemas used for the generative text.
*/
class Generator {
  constructor(options = {}) {
    this.modifier = Object.assign({}, modifiers);
    if (options.modifier) {
      this.modifier = Object.assign(this.modifier, options.modifier);
    }

    this.state = options.state || {};
    this.entry = options.entry;
    this.seed = options.seed;
    this.regex = options.regex || /[^ ]*::/g;
    this.schema = options.schema || {
      grammar: {},
      model: {}
    };
  }

  /*
    requires two things: the type of thing being added, and the data being added
  */
  add({ type, data }) {
    switch (true) {
      case type === undefined:
        throw new Error("Could not add because the type is undefined");
      case data === undefined:
        throw new Error("Could not add because the data is undefined");
      case type === "modifier" && validateData(data):
        return (this.modifier[data.name] = data.value);
      case validateData(data) && (type === "model" || type === "grammar"):
        return (this.schema[type][data.name] = data.value);
      default:
        const { name, value } = data;
        if (!name && !value) {
          throw new Error(
            `Could not set entry; no name (${name}) and value (${value}) provided`
          );
        }

        // entries can either be created or simply set from the available grammars.
        // if a value is provided, it is being added
        if (value) {
          return (this.entry = value);
        }

        // if a name is provided, get the corresponding grammar
        if (name && this.schema.grammar[name]) {
          return (this.entry = this.schema.grammar[name]);
        }

        return new Error(`Could not set entry; ${name} is not a grammar.`);
    }
  }

  /*
    wrapper for setting an entry.
  */
  setEntry(options = {}) {
    const { name, value } = options;
    return this.add({ type: "entry", data: { name, value } });
  }

  /*
    May provide a sub-section of the state in property: type.
    I.E.: you only want to know about current models, getState({type: 'models'});
  */
  getState(options = {}) {
    const { type } = options;
    if (type && this.state[type]) return this.state[type];
    return this.state;
  }

  split(options = {}) {
    let entry = options.entry || this.entry;
    let regex = options.regex || this.regex;
    return entry.match(regex).map(match => {
      let split = match.split(".");
      split[split.length - 1] = split[split.length - 1].slice(0, -2);
      return { match, split };
    });
  }

  mapReplacements(options = {}) {
    let entry = options.entry || this.entry;
    let regex = options.regex || this.regex;
    let splats = options.splats || [];
    let result = entry;
    splats
      .filter(splat => splat.replacement)
      .forEach(splat => {
        result = result.replace(splat.match, splat.replacement);
      });
    return result;
  }

  // starts with |
  getHelper(matcher = {}, options = {}) {
    let [modifier, value] = matcher.match.slice(1).split(":");
    let seed = options.seed || this.seed;
    let isHelper = matcher.match[0] === "|";

    return isHelper
      ? {
          ...matcher,
          replacement: this.modify({ modifier, value, seed })
        }
      : matcher;
  }

  getModel(matcher = {}, options = {}) {
    switch (matcher.split.length) {
      case 2:
        return this.getModelFromSchema(matcher, options);
      case 3:
        return this.getAndSetModelFromState(matcher, options);
      default:
        return matcher;
    }
  }

  getAndSetModelFromState(matcher = {}, options = {}) {
    let state = options.state || this.state;
    let schema = options.schema || this.schema.model;
    let seed = options.seed || this.seed;
    let [model, name, property] = matcher.split;
    let modifiers = null;

    if (property.includes("|")) {
      modifiers = property.split("|").slice(1);
      property = property.slice(0, property.indexOf("|"));
    }

    let replacement =
      state[model] && state[model][name] && state[model][name][property];

    if (!replacement) {
      if (state[model] === undefined) {
        state[model] = {};
      }
      if (state[model][name] === undefined) {
        state[model][name] = {};
      }
      if (state[model][name][property] === undefined) {
        state[model][name][property] = this.modelFromSchema({
          split: [model, property],
          schema,
          seed
        });
      }
      replacement = state[model][name][property];
    }

    if (modifiers) {
      replacement = modifiers.reduce((value, modifier) => {
        return this.modify({ modifier, value, seed });
      }, replacement);
    }
    return {
      ...matcher,
      replacement
    };
  }

  getModelFromSchema(matcher = {}, options = {}) {
    let schema = options.schema || this.schema.model;
    let seed = options.seed || this.seed;
    let [model, property] = matcher.split;
    let modifiers = null;

    if (schema[model] === undefined) {
      throw new Error(
        `model ${model} does not exist in provided schema: ${schema}`
      );
    }

    if (property.includes("|")) {
      modifiers = property.split("|").slice(1);
      property = property.slice(0, property.indexOf("|"));
    }

    if (schema[model][property] === undefined) {
      throw new Error(
        `model ${model} does not include property ${property} in provided schema: ${schema}`
      );
    }

    let replacement = this.sample({
      collection: schema[model][property],
      seed
    });

    if (modifiers) {
      replacement = modifiers.reduce((value, modifier) => {
        return this.modify({ modifier, value, seed });
      }, replacement);
    }

    return {
      ...matcher,
      replacement
    };
  }

  // starts with !
  unfurlGrammar(matcher = {}, options = {}) {
    let grammar = options.grammar || this.schema.grammar;
    let isGrammar = matcher.match[0] === "!";

    if (!isGrammar) return matcher;
    let entry = matcher.match.slice(1, -2);

    let newEntry = grammar[entry];

    if (newEntry === undefined) {
      throw new Error(
        `the grammar for ${entry} does not exist in the grammar schema: ${grammar}`
      );
    }

    let replacement = newEntry;

    return {
      ...matcher,
      replacement
    };
  }

  generateNewSeed(options = {}) {
    const modifier = options.modifier || 1;
    const seed = options.seed || this.seed || seedrandom.alea(Math.random())();
    const secondSeed = seedrandom.alea(`${seed}:${modifier}`)();
    return `${seed}:${secondSeed}`;
  }

  generate(splats = [], options = {}) {
    return splats
      .map(splat => this.getHelper(splat, options))
      .map(splat => this.getModel(splat, options))
      .map(splat => this.unfurlGrammar(splat, options));
  }

  /* Compiles and returns text. If a state is provided, it will use that. Otherwise it will run with a given state. */
  run(options = {}) {
    let entry = options.entry || this.entry;
    let regex = options.regex || this.regex;
    let model = options.model || this.schema.model;
    let state = options.state || this.state;
    let seed = options.seed || this.seed || seedrandom.alea(Math.random())();
    let schema = options.schema || this.schema.model;
    let reps = entry;

    while (reps.match(regex)) {
      let splats = this.generate(this.split({ entry: reps, regex }), { seed });
      reps = this.mapReplacements({ entry: reps, regex, splats });
    }

    return reps;
  }

  modelFromSchema(options = {}) {
    let schema = options.schema || this.schema.model;
    let [model, property] = options.split;
    let seed = options.seed || this.seed;

    if (property.includes("|"))
      property = property.slice(0, property.indexOf("|")); // remove modifier if it exists

    if (schema[model] === undefined)
      return new Error(
        `model ${model} does not exist in provided schema: ${schema}`
      );
    if (schema[model][property] === undefined)
      return new Error(
        `model ${model} does not include property ${property} in provided schema: ${schema}`
      );

    return this.sample({ collection: schema[model][property], seed });
  }

  // and then i guess i get to think about whehter modified models should simply be...changed in a different place. i think so? after the get...
  modify({ modifier, value, seed }) {
    let fn = this.modifier[modifier];
    if (fn === undefined) {
      throw new Error(
        `the modifier ${modifier} does not exist in: ${this.modifier}`
      );
    }

    if (typeof fn !== "function") {
      throw new Error(
        `the modifier ${modifier} does not appear to be a function: ${fn}`
      );
    }

    const options = Array.isArray(value) ? [...value.split("-")] : [value];
    return seed ? fn.apply(null, [...options, seed]) : fn.apply(null, options);
  }

  sample(options = {}) {
    let seed = options.seed || this.seed || seedrandom.alea(Math.random())();
    let collection = options.collection;

    if (collection === undefined)
      return new Error("no collection was provided from which to sample");
    if (typeof collection === "string") return collection;

    let rng = seedrandom.alea(seed);
    let index = Math.floor(rng() * collection.length);
    if (index < 0 || index >= collection.length)
      return new Error(
        `the calculated index of ${index} went out of bounds for this collection ${collection}`
      );
    return collection[index];
  }
}

export default Generator;
