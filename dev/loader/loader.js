const jetpack = require('fs-jetpack');

const loader = location => {
  const snippetFiles = jetpack.find(`${__dirname}/${location}`, {
    matching: '*.json'
  });
  const specs = snippetFiles.forEach(function (filename) {
    const snippet = jetpack.read(filename, 'json');
    return snippet;
  });
  return specs;
}

module.exports = loader;
