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
    "revision": "fd2e1a475a40f5c441bfca6d31291a1b"
  }, {
    "url": "assets/_...all_-f0314962.js",
    "revision": null
  }, {
    "url": "assets/app-f292bcab.js",
    "revision": null
  }, {
    "url": "assets/centered-4a179916.css",
    "revision": null
  }, {
    "url": "assets/centered-bb20475a.js",
    "revision": null
  }, {
    "url": "assets/index-aef8a8b5.js",
    "revision": null
  }, {
    "url": "assets/index-d210702b.css",
    "revision": null
  }, {
    "url": "assets/index-e0391102.css",
    "revision": null
  }, {
    "url": "assets/privacy-policy-4e512381.css",
    "revision": null
  }, {
    "url": "assets/privacy-policy-e5eab4b1.js",
    "revision": null
  }, {
    "url": "assets/terms-25ad673c.js",
    "revision": null
  }, {
    "url": "assets/terms-335f0e5d.css",
    "revision": null
  }, {
    "url": "assets/virtual_pwa-register-53c13262.js",
    "revision": null
  }, {
    "url": "assets/workbox-window.prod.es5-a7b12eab.js",
    "revision": null
  }, {
    "url": "de.html",
    "revision": "b9b8b14c8da2f81fad9612e48ee02c39"
  }, {
    "url": "de/privacy-policy.html",
    "revision": "1d43d230797507609396b5fc0ebec6ec"
  }, {
    "url": "de/terms.html",
    "revision": "eed59fb345b55b078b8fb081e97503b8"
  }, {
    "url": "en.html",
    "revision": "6cb2216842e9c1759142185858002124"
  }, {
    "url": "en/privacy-policy.html",
    "revision": "89e1e86549d16038f94d649114d0a9c2"
  }, {
    "url": "en/terms.html",
    "revision": "1d064723462ec891b56b4395f5ac3022"
  }, {
    "url": "index.html",
    "revision": "8b714e861bc66c63b055ce534a0b503a"
  }, {
    "url": "pl.html",
    "revision": "9bd6559afe928243d3bc62193f6a2796"
  }, {
    "url": "pl/privacy-policy.html",
    "revision": "52a2a48a06f8faa19a422fc7416cbaab"
  }, {
    "url": "pl/terms.html",
    "revision": "7375e8e64d3c390a259ea7407324e1d6"
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
    "revision": "d0f4bd53a92b341482d7df7532e786a7"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
