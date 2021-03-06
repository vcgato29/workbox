/*
  Copyright 2017 Google Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import {assert, WorkboxError, cacheNames} from 'workbox-core/_private.mjs';
import {Router} from './Router.mjs';
import {Route} from './Route.mjs';
import {RegExpRoute} from './RegExpRoute.mjs';
import {NavigationRoute} from './NavigationRoute.mjs';
import './_version.mjs';

if (process.env.NODE_ENV !== 'production') {
  assert.isSwEnv('workbox-routing');
}

/**
 * @private
 */
class DefaultRouter extends Router {
  /**
   * Easily register a Regular Expression or function with a caching
   * strategy to the Router.
   *
   * This method will generate a Route for you if needed and
   * call [Router.registerRoute()]{@link
   * workbox.routing.Router#registerRoute}.
   *
   * @param {
   * RegExp|
   * workbox.routing.Route~matchCallback|
   * workbox.routing.Route
   * } capture
   * If the capture param is a `Route`, all other arguments will be ignored.
   * @param {workbox.routing.Route~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   * @return {workbox.routing.Route} The generated `Route`(Useful for
   * unregistering).
   *
   * @alias workbox.routing.registerRoute
   */
  registerRoute(capture, handler, method = 'GET') {
    let route;
    // TODO Should we allow Express Route?
    // TODO If so - don't forget to add 'string' to params in jsdoc.
    /** if (typeof capture === 'string') {
      if (capture.length === 0) {
        throw new WorkboxError('empty-express-string', {
          moduleName: 'workbox-routing',
          class: 'DefaultRouter',
          func: 'registerRoute',
          paramName: 'capture',
        });
      }
      route = new ExpressRoute(capture, handler, method);
    } **/
    if (capture instanceof RegExp) {
      route = new RegExpRoute(capture, handler, method);
    } else if (typeof capture === 'function') {
      route = new Route(capture, handler, method);
    } else if (capture instanceof Route) {
      route = capture;
    } else {
      throw new WorkboxError('unsupported-route-type', {
        moduleName: 'workbox-routing',
        className: 'DefaultRouter',
        funcName: 'registerRoute',
        paramName: 'capture',
      });
    }

    super.registerRoute(route);
    return route;
  }

  /**
   * Register a route that will return a precached file for a navigation
   * request. This is useful for the
   * [application shell pattern]{@link https://developers.google.com/web/fundamentals/architecture/app-shell}.
   *
   * This method will generate a
   * [NavigationRoute]{@link workbox.routing.NavigationRoute}
   * and call
   * [Router.registerRoute()]{@link workbox.routing.Router#registerRoute}
   * .
   *
   * @param {string} cachedAssetUrl
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to precache cache name provided by
   * [workbox-core.cacheNames]{@link workbox.core.cacheNames}.
   * @param {Array<RegExp>} [options.blacklist=[]] If any of these patterns
   * match, the route will not handle the request (even if a whitelist entry
   * matches).
   * @param {Array<RegExp>} [options.whitelist=[/./]] If any of these patterns
   * match the URL's pathname and search parameter, the route will handle the
   * request (assuming the blacklist doesn't match).
   * @return {workbox.routing.NavigationRoute} Returns the generated
   * Route.
   *
   * @alias workbox.routing.registerNavigationRoute
   */
  registerNavigationRoute(cachedAssetUrl, options = {}) {
    if (process.env.NODE_ENV !== 'production') {
      assert.isType(cachedAssetUrl, 'string', {
        moduleName: 'workbox-routing',
        className: '[default export]',
        funcName: 'registerNavigationRoute',
        paramName: 'cachedAssetUrl',
      });
    }

    const cacheName = cacheNames.getPrecacheName(options.cacheName);
    const handler = () => caches.match(cachedAssetUrl, {cacheName});
    const route = new NavigationRoute(handler, {
      whitelist: options.whitelist,
      blacklist: options.blacklist,
    });
    super.registerRoute(
      route
    );
    return route;
  }
}

const router = new DefaultRouter();

// By default, register a fetch event listener that will respond to a request
// only if there's a matching route.
self.addEventListener('fetch', (event) => {
  const responsePromise = router.handleRequest(event);
  if (responsePromise) {
    event.respondWith(responsePromise);
  }
});

export default router;
