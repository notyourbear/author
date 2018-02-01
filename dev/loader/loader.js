const jetpack = require('fs-jetpack')
const path = require('path')

const loader = location => {
  const snippetFiles = jetpack.find(path.resolve(`${location}`), {
    matching: '*.json'
  })

  const specs = snippetFiles.reduce((sp, filename) => {
    const snippet = jetpack.read(filename, 'json')
    const cats = ['model', 'grammar']

    cats.forEach(cat => {
      if (snippet[cat]) {
        Object.keys(snippet[cat]).forEach(key => {
          if (sp[cat][key]) {
            sp[cat][key] = [].concat(sp[cat][key], snippet[cat][key])
          } else {
            sp[cat][key] = snippet[cat][key]
          }
        })
      }
    })
    if (snippet.entry) sp.entry = snippet.entry

    return Object.assign({}, sp)
  }, {
    model: {},
    grammar: {},
    entry: null
  })

  return specs
}

module.exports = loader
