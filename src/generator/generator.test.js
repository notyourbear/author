import Generator from "./index.js";

describe("Generator", () => {
  describe("Generator.add", () => {
    test("return error if no attributes are present", () => {
      let gen = new Generator();
      let e = gen.add({ data: "thing" });
      let e2 = gen.add({ name: "thing" });
      let e3 = gen.add();
      expect(e instanceof Error).toBe(true);
      expect(e2 instanceof Error).toBe(true);
      expect(e3 instanceof Error).toBe(true);
    });

    test("return error if type is unnaccepted", () => {
      let gen = new Generator();
      let toAdd = {
        name: "farmer",
        value: {
          name: ["Patrick", "Benjamin", "Joe", "Bill", "Channing"]
        }
      };

      let e = gen.add({ data: toAdd, type: "Model" });
      expect(e instanceof Error).toBe(true);
    });

    test("add a model", () => {
      let toAdd = {
        name: "farmer",
        value: {
          name: ["Patrick", "Benjamin", "Joe", "Bill", "Channing"]
        }
      };
      let gen = new Generator();
      gen.add({ type: "model", data: toAdd });
      let result = {
        farmer: {
          name: ["Patrick", "Benjamin", "Joe", "Bill", "Channing"]
        }
      };

      expect(gen.schema.model).toMatchObject(result);
    });

    test("add a grammar", () => {
      let grammar = {
        name: "place",
        value: "farmer.Head.name::'s market"
      };
      let gen = new Generator();
      gen.add({ type: "grammar", data: grammar });

      expect(gen.schema.grammar).toMatchObject({ place: grammar.value });
    });

    test("throw error if trying to add entry from unavailable grammar", () => {
      let gen = new Generator();
      let e = gen.add({ type: "entry", data: { name: "unavailable" } });
      expect(e instanceof Error).toBe(true);
    });

    test("add a modifier", () => {
      let double = str => `${str}${str}`;
      let gen = new Generator();
      gen.add({ type: "modifier", data: { name: "double", value: double } });
      expect(gen.modifier["double"]).toBeDefined();
      expect(gen.modify({ modifier: "double", value: "hello" })).toEqual(
        "hellohello"
      );
    });
  });

  describe("Generator.setEntry", () => {
    test("with new value", () => {
      let val = "farmer.name:: went with farmer.Head.name:: to !place::";
      let gen = new Generator();
      gen.setEntry({ value: val });
      expect(gen.entry).toEqual(val);
    });

    test("via pointer to grammar (name)", () => {
      let gen = new Generator();
      let grammar = {
        name: "place",
        value: "farmer.Head.name::'s market"
      };
      gen.add({ type: "grammar", data: grammar });
      gen.setEntry({ name: "place" });
      expect(gen.entry).toEqual(grammar.value);
    });
  });

  describe("Generator.sample", () => {
    test("without seed", () => {
      let arr = [1, 2, 3];
      let gen = new Generator();
      let result = gen.sample({ collection: arr });
      let isCorrect = result === 1 || result === 2 || result === 3;
      expect(isCorrect).toBe(true);
    });

    test("with seed", () => {
      let arr = [1, 2, 3];
      let gen = new Generator();
      let result = gen.sample({ collection: arr, seed: "this is a seed" });
      expect(result).toEqual(1);
    });

    test("throw error if no collection provided", () => {
      let gen = new Generator();
      let e = gen.sample();
      expect(e instanceof Error).toBe(true);
    });
  });

  describe("Generator.run", () => {
    describe("without provided seed", () => {
      let gen = new Generator();
      let model = {
        name: "farmer",
        value: {
          name: ["Patrick", "Benjamin", "Joe"]
        }
      };
      let grammar = {
        name: "place",
        value: "farmer.Head.name::'s market"
      };

      gen.setEntry({
        value: "farmer.name:: went with farmer.Head.name:: to !place::"
      });
      gen.add({ type: "model", data: model });
      gen.add({ type: "grammar", data: grammar });

      let result = gen.run();

      let possibleResults = [];
      model.value.name.forEach(name1 => {
        model.value.name.forEach(name2 => {
          possibleResults.push(
            `${name1} went with ${name2} to ${name2}'s market`
          );
        });
      });
      expect(possibleResults.includes(result)).toBe(true);
    });

    describe("with provided seed", () => {
      let gen = new Generator();
      let model = {
        name: "farmer",
        value: {
          name: ["Patrick", "Benjamin", "Joe", "Bill", "Chris"]
        }
      };
      let grammar = {
        name: "place",
        value: "farmer.Head.name::'s market"
      };

      gen.setEntry({
        value: "farmer.name:: went with farmer.Head.name:: to !place::"
      });
      gen.add({ type: "model", data: model });
      gen.add({ type: "grammar", data: grammar });
      gen.seed = "this is a seed for a name";

      let result = gen.run({ randomizeSchemaSelections: true });

      expect(result).toBe("Patrick went with Benjamin to Benjamin's market");
    });

    describe("with modified model in grammar", () => {
      let gen = new Generator({ seed: "this is a seed for a name" });
      let model = {
        name: "farmer",
        value: {
          name: ["Patrick", "Benjamin", "Joe", "Bill", "Chris"]
        }
      };
      let grammar = {
        name: "place",
        value: "farmer.Head.name|possessive:: market"
      };

      gen.add({ type: "model", data: model });
      gen.add({ type: "grammar", data: grammar });
      gen.setEntry({
        value: "farmer.name:: went with farmer.Head.name:: to !place::"
      });

      let result = gen.run({ randomizeSchemaSelections: true });
      expect(result).toBe("Patrick went with Benjamin to Benjamin's market");
    });

    describe("with modifier in grammar", () => {
      let gen = new Generator({ seed: "this is a seed for a name" });
      let model = {
        name: "farmer",
        value: {
          name: ["Patrick", "Benjamin", "Joe", "Bill", "Chris"]
        }
      };
      let grammar = {
        name: "place",
        value:
          "farmer.Head.name|articlize|possessive:: market built in |between:1917-1917::"
      };

      gen.add({ type: "model", data: model });
      gen.add({ type: "grammar", data: grammar });
      gen.setEntry({
        value: "farmer.name:: went with farmer.Head.name:: to !place::"
      });

      let result = gen.run({ randomizeSchemaSelections: true });
      expect(result).toBe(
        "Patrick went with Benjamin to a Benjamin's market built in 1917"
      );
    });
  });

  describe("Generator.getState", () => {
    let gen = new Generator({ seed: "a stately seed" });
    let model = {
      name: "farmer",
      value: {
        name: ["Patrick", "Benjamin", "Joe", "Bill", "Chris"]
      }
    };
    let grammar = {
      name: "place",
      value: "farmer.Head.name::'s market"
    };

    gen.add({ type: "model", data: model });
    gen.add({ type: "grammar", data: grammar });
    gen.setEntry({
      value: "farmer.name:: went with farmer.Head.name:: to !place::"
    });
    gen.run();
    let state = gen.getState();
    expect(state).toMatchObject({ farmer: { Head: { name: "Patrick" } } });
  });
});
