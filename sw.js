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
    "revision": "dca1e07bd5885c4ed9544e91e54bf321"
  }, {
    "url": "assets/_...all_-7ba07212.js",
    "revision": null
  }, {
    "url": "assets/app-28598460.js",
    "revision": null
  }, {
    "url": "assets/centered-2aed6be4.js",
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
    "url": "assets/index-ff504e40.js",
    "revision": null
  }, {
    "url": "assets/privacy-policy-473f4136.js",
    "revision": null
  }, {
    "url": "assets/privacy-policy-4e512381.css",
    "revision": null
  }, {
    "url": "assets/terms-335f0e5d.css",
    "revision": null
  }, {
    "url": "assets/terms-e955442a.js",
    "revision": null
  }, {
    "url": "assets/virtual_pwa-register-cb537683.js",
    "revision": null
  }, {
    "url": "assets/workbox-window.prod.es5-a7b12eab.js",
    "revision": null
  }, {
    "url": "de.html",
    "revision": "2da900be9f8b1e42b2b35f85be181e94"
  }, {
    "url": "de/privacy-policy.html",
    "revision": "47542506427c576b365feedb4d5abb4f"
  }, {
    "url": "de/terms.html",
    "revision": "c5ee75f321bea66cfa4df3cdf04033b0"
  }, {
    "url": "en.html",
    "revision": "1ee9d30f0a43c5381deab381d7971374"
  }, {
    "url": "en/privacy-policy.html",
    "revision": "3120a772f0228169151728c57c1ee5ca"
  }, {
    "url": "en/terms.html",
    "revision": "9ee9a534bf170d37f4b2077a622dc164"
  }, {
    "url": "index.html",
    "revision": "240717acbdc391ac906909d8b02b053a"
  }, {
    "url": "pl.html",
    "revision": "5d39557eb649c61b4748a33475cab2be"
  }, {
    "url": "pl/privacy-policy.html",
    "revision": "d9e3b7650d5cea9e25aae62c005cdb56"
  }, {
    "url": "pl/terms.html",
    "revision": "32b9c0ddb90cbbb44563bed8442fd937"
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
