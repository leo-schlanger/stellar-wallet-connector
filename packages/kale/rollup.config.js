import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.esm.js',
    format: 'esm',
    sourcemap: true
  },
  external: [
    '@stellar/stellar-sdk',
    '@stellar-wallet-connector/core',
    'react'
  ],
  plugins: [
    typescript()
  ]
};
