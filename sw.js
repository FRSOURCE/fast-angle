/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-9faaa4b3'], (function (workbox) { 'use strict';

  /**
  * Welcome to your Workbox-powered service worker!
  *
  * You'll need to register this file in your web app.
  * See https://goo.gl/nhQhGp
  *
  * The rest of the code is auto-generated. Please don't update this file
  * directly; instead, make changes to your Workbox build configuration
  * and re-run your build process.
  * See https://goo.gl/2aRDsh
  */

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */

  workbox.precacheAndRoute([{
    "url": "404.html",
    "revision": "368c4a897389bf25a2274120bb1b2f71"
  }, {
    "url": "assets/_...all_-37f3f0c9.js",
    "revision": null
  }, {
    "url": "assets/app-d2dc1a84.js",
    "revision": null
  }, {
    "url": "assets/centered-3bc88e67.js",
    "revision": null
  }, {
    "url": "assets/centered-4a179916.css",
    "revision": null
  }, {
    "url": "assets/index-d210702b.css",
    "revision": null
  }, {
    "url": "assets/index-e0391102.css",
    "revision": null
  }, {
    "url": "assets/index-e7d3d402.js",
    "revision": null
  }, {
    "url": "assets/privacy-policy-4e512381.css",
    "revision": null
  }, {
    "url": "assets/privacy-policy-decf0cbb.js",
    "revision": null
  }, {
    "url": "assets/terms-078dc1fe.js",
    "revision": null
  }, {
    "url": "assets/terms-335f0e5d.css",
    "revision": null
  }, {
    "url": "assets/virtual_pwa-register-ca0113b9.js",
    "revision": null
  }, {
    "url": "assets/workbox-window.prod.es5-a7b12eab.js",
    "revision": null
  }, {
    "url": "de.html",
    "revision": "68cef5515636b3892356a7b53b322d88"
  }, {
    "url": "de/privacy-policy.html",
    "revision": "d4c54ca3605802767e5370dc9d77b126"
  }, {
    "url": "de/terms.html",
    "revision": "97aba6abe2fa1c329e458fe569815106"
  }, {
    "url": "en.html",
    "revision": "a801c2bb94a21e7972ab4aa71af3c5e9"
  }, {
    "url": "en/privacy-policy.html",
    "revision": "36637ac5b6dbc90582d189b302819bff"
  }, {
    "url": "en/terms.html",
    "revision": "aca193eb6c23c61f1f08e3d9bd070277"
  }, {
    "url": "index.html",
    "revision": "5279041c70e8acd5c51318a64ecdb55f"
  }, {
    "url": "pl.html",
    "revision": "4abaf489ea3a36a592f5f467609b26d4"
  }, {
    "url": "pl/privacy-policy.html",
    "revision": "a41ea21f73ec014e2f6b8ff1dbd5a476"
  }, {
    "url": "pl/terms.html",
    "revision": "c0a5341bf6bc2f7426ba3f1d99770a6e"
  }, {
    "url": "favicon-dark.svg",
    "revision": "98cd02853d9e8386612b5fbd7f9eb630"
  }, {
    "url": "favicon.svg",
    "revision": "e476a8de9eefda3467f128aed07c007d"
  }, {
    "url": "pwa-192x192.png",
    "revision": "307aeecc8a6cf708adcbd0b21274b92f"
  }, {
    "url": "pwa-512x512.png",
    "revision": "50c3254ba3466da79827fcceb4807241"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "5123dacbec6173fc269500f01c0834a8"
  }, {
    "url": "pwa-monochrome-192x192.png",
    "revision": "47c8c3bba4d5b3cc780c268659f6a3fc"
  }, {
    "url": "safari-pinned-tab.svg",
    "revision": "037dc7a68e4764080ef4d13890a13140"
  }, {
    "url": "manifest.webmanifest",
    "revision": "47ea7743e6e7dc83394ed1fe454ee7e3"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
