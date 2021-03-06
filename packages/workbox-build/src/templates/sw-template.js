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

module.exports = `/**
 * Welcome to your Workbox-powered service worker!
 *
 * Here are some next steps:
 *
 * - Your web app needs to register this file.
 *   See https://goo.gl/DNGzMp
 *
 * - Disable HTTP caching for this file.
 *   See https://goo.gl/rWuKgq
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/YYPcyY
 */
 
<% if (importScripts) { %>
importScripts(<%= importScripts.map(JSON.stringify).join(',') %>);
<% } %>

<% if (modulePathPrefix) { %>workbox.setConfig({modulePathPrefix: <%= JSON.stringify(modulePathPrefix) %>});<% } %>
<% if (cacheId) { %>workbox.core.setCacheNameDetails({prefix: <%= JSON.stringify(cacheId) %>});<% } %>

<% if (skipWaiting) { %>workbox.skipWaiting();<% } %>
<% if (clientsClaim) { %>workbox.clientsClaim();<% } %>

<% if (Array.isArray(manifestEntries)) {%>
/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/GYZoHL
 */
self.__precacheManifest = <%= JSON.stringify(manifestEntries, null, 2) %>.concat(self.__precacheManifest || []);
<% } %>
if (Array.isArray(self.__precacheManifest)) {
  workbox.precaching.precacheAndRoute(self.__precacheManifest, <%= precacheOptionsString %>);
}

<% if (navigateFallback) { %>workbox.routing.registerNavigationRoute(<%= JSON.stringify(navigateFallback) %><% if (navigateFallbackWhitelist || navigateFallbackBlacklist) { %>, {
  <% if (navigateFallbackWhitelist) { %>whitelist: [<%= navigateFallbackWhitelist %>],<% } %>
  <% if (navigateFallbackBlacklist) { %>blacklist: [<%= navigateFallbackBlacklist %>],<% } %>
}<% } %>);<% } %>

<% if (runtimeCaching) { runtimeCaching.forEach(runtimeCachingString => {%><%= runtimeCachingString %><% });} %>`;
