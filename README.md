## Deutung
A model-backed generative text grammar tool

### Basic Usage

```
const Deutung = require('deutung');

const schema = {
  "model": {
    "writer": {
      "name": ["patrick", "benjamin"],
      "vocation": "writer",
      "age": "|between:20-40"
    },
    "artist": {
      "name": "paul",
      "vocation": ["painter", "modeler"]
    }
  },
  "entry": "::writer.name|capitalize:: went with ::artist.Protagonist.name|capitalize:: to ::!place::",
  "grammar": {
    "place": "the ::artist.Protagonist.vocation::'s favorite bar, which was opened in ::|between:1904-1982::."
  }
};

const result = Deutung(schema);

/*
{
  compiled: 'Benjamin went with Paul to the modeler\'s favorite bar, which was opened in 1940.',
  state: {
    Protagonist: {
      name: 'Paul',
      vocation: 'Modeler'
    }
  }
}
*/
```
Deutung takes in a schema to create a generated text based on the models, grammars, and entry provided.
This schema can either be a JSON file, or a JS object (as shown in the example above).
The resulting variable includes both the `compiled` (generated) text, and a `state` object that provides any 'locked' characters created.

Generation using models in Deutung can be done with 'locked' and generated characters:

Generated properties are always created at runtime, chosen from the available options in the model.
In the example above, the grammar `::writer.name::` will always produce either `patrick` or `benjamin`.

Locked characters will always remain the same once generated.
The grammar `::artist.Protagonist.vocation::` will check the generator's state for the object `Protagonist`. If this doesn't yet exist, it will be generated, and upon any further request for a grammar using that model, it will be used.
Locked characters are based on the identical concept in Bruno Diaz's text generative tool, Improv.

### Schemas

Schemas are the heart and soul of working with Deutung. Schemas are made up of three parts: 'model', 'grammar', and 'entry'.

In short:
- Models are the information being generated.
- Grammars are the sentence structure that contain models.
- The entry is the first grammar being read.

#### Models

Models are provided as objects, the key of which is used in the grammar to look up the model.
For the following model of an artist, a grammar may access the property 'name' as `::artist.name::`.
```
"models": {
  "artist": {
    "name": "paul",
    "vocation": ["painter", "modeler"],
    "age": "|between:25-40"
  }
}
```
Model properties can be provided as strings or array of strings. In the event of an array, the property will be chosen at random from the options provided.

Models also can be provided with functions to produce a result. In the example above, the built-in function `between` is provided to create a number between `25` and `40`. Functions are provided as strings that start with a `|` and take on the following structure `|[functionName]:[providedInput]-[providedInput]`.

Deutung comes with the following functions built-in:
- between (low, high): returns a number between `low` and `high`, inclusive.
- capitalize (string): returns capitalized `string`.
- pluralize (string): returns plural form of `string`.
- possessive (string): returns possessive case of `string`.
- uppercase (string): returns uppercase version of `string`.

Functions can be used in models or directly in grammars.
