import babel from 'rollup-plugin-babel';
import copy from 'rollup-plugin-copy';
import bundleSize from 'rollup-plugin-bundle-size';

import pkg from './package.json';

const globals = { react: 'React' };

const cjs = {
  globals,
  format: 'cjs',
  exports: 'named',
  sourcemap: true,
};

const esm = {
  globals,
  format: 'es',
  sourcemap: true,
};

const getCJS = override => Object.assign({}, cjs, override);
const getESM = override => Object.assign({}, esm, override);

export default {
  input: './src/index.js',
  output: [
    getESM({ file: 'dist/index.es.js' }),
    getCJS({ file: 'dist/index.cjs.js' }),
  ],
  external: [
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
  ],
  plugins: [
    bundleSize(),
    babel({
      presets: ["@babel/preset-react"],
    }),
    copy({
      targets: [{ src: 'src/styles.css', dest: 'dist' }],
    }),
  ],
};
