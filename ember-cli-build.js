'use strict';
import EmberApp from 'ember-cli/lib/broccoli/ember-app.js';

import { compatBuild } from '@embroider/compat';
import { buildOnce } from '@embroider/vite';

export default async function (defaults) {
  const app = new EmberApp(defaults, {
    emberData: {
      deprecations: {
        // New projects can safely leave this deprecation disabled.
        // If upgrading, to opt-into the deprecated behavior, set this to true and then follow:
        // https://deprecations.emberjs.com/id/ember-data-deprecate-store-extends-ember-object
        // before upgrading to Ember Data 6.0
        DEPRECATE_STORE_EXTENDS_EMBER_OBJECT: false,
      },
    },
    // Add options here
  });

  return compatBuild(app, buildOnce);
}
