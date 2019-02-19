// import typescript from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import pkg from './package.json';

const extensions = ['.js', '.ts'];

const babelPluginConfig = {
  extensions,
  exclude: 'node_modules/**',
};

export default [
  {
    input: 'src/index.ts',
    output: [{ name: '__shimport__', file: pkg.main, format: 'iife' }],
    plugins: [
			nodeResolve({ extensions }),
			commonjs(),
      replace({ __VERSION__: pkg.version }),
      babel(babelPluginConfig),
      terser(),
      {
        renderChunk(code) {
          return {
            code: code.replace('alert', '(0,eval)'),
            map: null,
          };
        },
      },
      filesize(),
    ],
  },

  {
    input: 'src/index.ts',
    output: [{ name: '__shimport__', file: 'index.dev.js', format: 'iife' }],
    plugins: [
			nodeResolve({ extensions }),
			commonjs(),
      replace({ __VERSION__: pkg.version }),
      babel(babelPluginConfig),
      {
        renderChunk(code) {
          return {
            code: code.replace('alert', '(0,eval)'),
            map: null,
          };
        },
      },
    ],
  },
];
