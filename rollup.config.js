const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const progress = require('rollup-plugin-progress');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const filesize = require('rollup-plugin-filesize');

export default {
  input: 'dev/generator/generator.js',
  output: {
    file: 'index.js',
    format: 'umd',
    name: 'Deutung',
    globals: {
      pluralize: '*',
      seedrandom: '*',
      articles: '*',
      crypto: 'nodecrypto',
    }
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
      preferBuiltins: false,
      modulesOnly: false
    }),
    commonjs(),
    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    globals(),
    builtins(),
    filesize(),
    progress(),
  ]
};
