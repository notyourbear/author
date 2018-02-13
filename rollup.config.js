const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const uglify = require('rollup-plugin-uglify')
const replace = require('rollup-plugin-replace')
const builtins = require('rollup-plugin-node-builtins')
const globals = require('rollup-plugin-node-globals')

export default {
  input: 'dev/generator/generator.js',
  output: {
    file: 'index.js',
    format: 'umd',
    name: 'Deutung'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    builtins(),
    globals(),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    uglify()
  ]
};
