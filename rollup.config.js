import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

export default {
  input: 'extension/scripts/detector.js',
  output: {
    file: 'extension/dist/detector.bundle.js',
    format: 'iife',
    name: 'AIComplianceDetector',
    sourcemap: false,
    globals: {
      '@xenova/transformers': 'Transformers'
    }
  },
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    copy({
      targets: [
        {
          src: 'node_modules/@xenova/transformers/dist/*.wasm',
          dest: 'extension/dist'
        },
        {
          src: 'node_modules/onnxruntime-web/dist/*.wasm',
          dest: 'extension/dist'
        }
      ],
      hook: 'writeBundle'
    }),
    terser({
      compress: {
        drop_console: false // Keep console for debugging
      }
    })
  ]
};
