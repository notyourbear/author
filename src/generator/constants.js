const RUN_ORDER = ["split", "unfurlGrammars", "setHelper", "modify"];

//{ splats:
[
  { match: "character.Hero.archetype::", split: [Array] },
  { match: "location.setting::", split: [Array] },
  { match: "animal.Animal.type|articlize::", split: [Array] }
];
