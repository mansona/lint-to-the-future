import { defineConfig } from 'vite';
import {
  extensions,
  ember,
  hbs,
  scripts,
  assets,
  configTargets,
} from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import { mockDataMiddleware } from './server/index.js';

function classicEmberSupportWithoutPrebuild() {
  return [hbs(), scripts(), assets(), configTargets()];
}

export default defineConfig({
  plugins: [
    mockDataMiddleware(),
    classicEmberSupportWithoutPrebuild(),
    ember(),
    // extra plugins here
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
  ],
});
