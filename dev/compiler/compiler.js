const compiler = (grammar, replacementsArray) => {
  const regex = /::\.|[^ ]*::/
  let string = grammar

  return replacementsArray.reduce((result, replacement) => {
	return result.replace(regex, replacement)
}, string)
}

module.exports = compiler
