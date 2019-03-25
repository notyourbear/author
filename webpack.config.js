module.exports = (env, args) => ({
  entry: './src',
  mode: 'none',
  devtool: 'none',
  output: {
    library: 'Deutung',
    libraryTarget: 'umd',
    filename: 'Deutung.js',
    globalObject: 'this'
  }
});
