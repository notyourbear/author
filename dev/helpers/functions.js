const functions = {}


const sample = collection => {
  if (typeof collection === 'string') return collection
  const index = Math.floor(Math.random() * collection.length)
  return collection[index]
}


module.exports = {
  sample
}
