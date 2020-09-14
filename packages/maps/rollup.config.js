import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import { eslint } from 'rollup-plugin-eslint'
import json from '@rollup/plugin-json'
import serve from 'rollup-plugin-serve'

import pkg from './package.json'
// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
// eslint-disable-next-line no-undef
const production = !process.env.ROLLUP_WATCH;


export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'Metro',
      sourcemap: !production,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: !production,
    },
  ],
  plugins: [
    eslint({
      throwOnError: true,
      fix: true,
    }),
    external(),
    resolve(),
    json(),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
      tsconfig: './tsconfig.json',
    }),
    commonjs(),
    !production && serve({
      open: true,
      contentBase: '.',
      openPage: '/example.html',
    }),
  ],
}
