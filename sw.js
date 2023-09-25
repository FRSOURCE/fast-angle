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
    "revision": "5b0bb6d567a4a8d2e4e69d8d09e91711"
  }, {
    "url": "assets/_...all_-b0c409f4.js",
    "revision": null
  }, {
    "url": "assets/app-2665ae72.js",
    "revision": null
  }, {
    "url": "assets/centered-4a179916.css",
    "revision": null
  }, {
    "url": "assets/centered-efa9bc6b.js",
    "revision": null
  }, {
    "url": "assets/index-7c82f955.js",
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
    "url": "assets/privacy-policy-cf35d42f.js",
    "revision": null
  }, {
    "url": "assets/terms-335f0e5d.css",
    "revision": null
  }, {
    "url": "assets/terms-7b6955e4.js",
    "revision": null
  }, {
    "url": "assets/virtual_pwa-register-1f7529a5.js",
    "revision": null
  }, {
    "url": "assets/workbox-window.prod.es5-a7b12eab.js",
    "revision": null
  }, {
    "url": "de.html",
    "revision": "40da529b6dce087c15ebb60808c95c6e"
  }, {
    "url": "de/privacy-policy.html",
    "revision": "337afdbe0ffe38dba7ad67792c4260c0"
  }, {
    "url": "de/terms.html",
    "revision": "7b74da1e5ddaa9b78b34205af1be044d"
  }, {
    "url": "en.html",
    "revision": "7b6219efdd6e8a2d87dc79297363e906"
  }, {
    "url": "en/privacy-policy.html",
    "revision": "d08aa778e37e785e5894bbb08f5433d8"
  }, {
    "url": "en/terms.html",
    "revision": "b4a94b5949f11809dfc37636af84c5e2"
  }, {
    "url": "index.html",
    "revision": "23c4a511eb7a2c8e5c4ebd6b745479bb"
  }, {
    "url": "pl.html",
    "revision": "917e539d4fbcc4fca36c26d2d9f3e9a5"
  }, {
    "url": "pl/privacy-policy.html",
    "revision": "bd1d5228fe399fd9924f4f2bfe1d0c7b"
  }, {
    "url": "pl/terms.html",
    "revision": "cf52787c9a10e225c69e3ffd35e47bb9"
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
