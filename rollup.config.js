import typescript from 'rollup-plugin-typescript2'

const cfg = (format) => ({
  external: ['react', 'prop-ops'],
  input: './src/index.tsx',
  output: {
    file: `./lib/index.${format}.js`,
    format,
  },
  plugins: [
    typescript(),
  ]
})

export default [cfg('esm'), cfg('cjs')]
