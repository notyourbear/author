const functions = {}


const sample = collection => {
  if (typeof collection === 'string') return collection
  const index = Math.floor(Math.random() * collection.length)
  return collection[index]
}

const checkIfAlreadyGenerated = (model1, model2, simsAllowed = 0) => {
  const similarities = Object.keys(model1).reduce((sims, key) => {
    if (key === 'type') return sims
    return model1[key] === model2[key] ? sims += 1 : sims
  }, 0)

  return similarities >= simsAllowed
}


module.exports = {
  sample,
  checkIfAlreadyGenerated
}
