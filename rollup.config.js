import babel from 'rollup-plugin-babel';
import copy from 'rollup-plugin-copy';
import bundleSize from 'rollup-plugin-bundle-size';

import pkg from './package.json';

const globals = { react: 'React' };

export default {
  input: './src/index.js',
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
      globals,
      exports: 'named',
    },
    {
      file: pkg.module,
      format: "esm",
      sourcemap: true,
      globals,
    },
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
