import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'extension/scripts/detector.js',
  output: {
    file: 'extension/dist/detector.bundle.js',
    format: 'iife',
    name: 'AIComplianceDetector',
    sourcemap: false
  },
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    terser({
      compress: {
        drop_console: false // Keep console for debugging
      }
    })
  ]
};
