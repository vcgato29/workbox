const expect = require('chai').expect;
const path = require('path');

const getManifest = require('../../../../packages/workbox-build/src/entry-points/get-manifest');

describe(`[workbox-build] entry-points/get-manifest.js (End to End)`, function() {
  const SRC_DIR = path.join(__dirname, '..', '..', 'static', 'example-project-1');
  const BASE_OPTIONS = {
    globDirectory: SRC_DIR,
  };
  const REQUIRED_PARAMS = ['globDirectory'];
  const SUPPORTED_PARAMS = [
    'dontCacheBustUrlsMatching',
    'globIgnores',
    'globPatterns',
    'manifestTransforms',
    'maximumFileSizeToCacheInBytes',
    'modifyUrlPrefix',
    'templatedUrls',
  ].concat(REQUIRED_PARAMS);
  const UNSUPPORTED_PARAMS = [
    'cacheId',
    'clientsClaim',
    'directoryIndex',
    'ignoreUrlParametersMatching',
    'importScripts',
    'importWorkboxFromCDN',
    'injectionPointRegexp',
    'navigateFallback',
    'navigateFallbackWhitelist',
    'runtimeCaching',
    'skipWaiting',
    'swSrc',
    'swDest',
  ];

  describe('[workbox-build] required parameters', function() {
    for (const requiredParam of REQUIRED_PARAMS) {
      it(`should reject with a ValidationError when '${requiredParam}' is missing`, async function() {
        const options = Object.assign({}, BASE_OPTIONS);
        delete options[requiredParam];

        try {
          await getManifest(options);
          throw new Error('Unexpected success.');
        } catch (error) {
          expect(error.name).to.eql('ValidationError');
          expect(error.details[0].context.key).to.eql(requiredParam);
        }
      });
    }
  });

  describe('[workbox-build] unsupported parameters', function() {
    for (const unsupportedParam of UNSUPPORTED_PARAMS) {
      it(`should reject with a ValidationError when '${unsupportedParam}' is present`, async function() {
        const options = Object.assign({}, BASE_OPTIONS);
        options[unsupportedParam] = unsupportedParam;

        try {
          await getManifest(options);
          throw new Error('Unexpected success.');
        } catch (error) {
          expect(error.name).to.eql('ValidationError');
          expect(error.details[0].context.key).to.eql(unsupportedParam);
        }
      });
    }
  });

  describe('[workbox-build] invalid parameter values', function() {
    for (const param of SUPPORTED_PARAMS) {
      it(`should reject with a ValidationError when '${param}' is null`, async function() {
        const options = Object.assign({}, BASE_OPTIONS);
        options[param] = null;

        try {
          await getManifest(options);
          throw new Error('Unexpected success.');
        } catch (error) {
          expect(error.name).to.eql('ValidationError');
          expect(error.details[0].context.key).to.eql(param);
        }
      });
    }
  });

  describe('[workbox-build] should generate a valid manifest when properly configured', function() {
    it(`should use defaults when all the required parameters are present`, async function() {
      const options = Object.assign({}, BASE_OPTIONS);

      const {count, size, manifestEntries} = await getManifest(options);

      expect(manifestEntries).to.deep.equal([{
        url: 'index.html',
        revision: '3883c45b119c9d7e9ad75a1b4a4672ac',
      }, {
        url: 'page-1.html',
        revision: '544658ab25ee8762dc241e8b1c5ed96d',
      }, {
        url: 'page-2.html',
        revision: 'a3a71ce0b9b43c459cf58bd37e911b74',
      }, {
        url: 'styles/stylesheet-1.css',
        revision: '934823cbc67ccf0d67aa2a2eeb798f12',
      }, {
        url: 'styles/stylesheet-2.css',
        revision: '884f6853a4fc655e4c2dc0c0f27a227c',
      }, {
        url: 'webpackEntry.js',
        revision: 'd41d8cd98f00b204e9800998ecf8427e',
      }]);
      expect(count).to.eql(6);
      expect(size).to.eql(2421);
    });

    it(`should use defaults when all the required parameters, and 'globPatterns' are present`, async function() {
      const options = Object.assign({
        globPatterns: ['**/*.html', '**/*.js'],
      }, BASE_OPTIONS);

      const {count, size, manifestEntries} = await getManifest(options);

      expect(manifestEntries).to.deep.equal([{
        url: 'index.html',
        revision: '3883c45b119c9d7e9ad75a1b4a4672ac',
      }, {
        url: 'page-1.html',
        revision: '544658ab25ee8762dc241e8b1c5ed96d',
      }, {
        url: 'page-2.html',
        revision: 'a3a71ce0b9b43c459cf58bd37e911b74',
      }, {
        url: 'webpackEntry.js',
        revision: 'd41d8cd98f00b204e9800998ecf8427e',
      }]);
      expect(count).to.eql(4);
      expect(size).to.eql(2352);
    });

    it(`should use defaults when all the required parameters, and 'globIgnores' are present`, async function() {
      const options = Object.assign({
        globIgnores: ['**/*.html', '**/*.js'],
      }, BASE_OPTIONS);

      const {count, size, manifestEntries} = await getManifest(options);

      expect(manifestEntries).to.deep.equal([{
        url: 'styles/stylesheet-1.css',
        revision: '934823cbc67ccf0d67aa2a2eeb798f12',
      }, {
        url: 'styles/stylesheet-2.css',
        revision: '884f6853a4fc655e4c2dc0c0f27a227c',
      }]);
      expect(count).to.eql(2);
      expect(size).to.eql(69);
    });

    it(`should use defaults when all the required parameters, 'globIgnores', and 'globPatterns' are present`, async function() {
      const options = Object.assign({
        globPatterns: ['**/*.css', '**/*.js'],
        globIgnores: ['node_modules/**/*', '**/*2*'],
      }, BASE_OPTIONS);

      const {count, size, manifestEntries} = await getManifest(options);

      expect(manifestEntries).to.deep.equal([{
        url: 'styles/stylesheet-1.css',
        revision: '934823cbc67ccf0d67aa2a2eeb798f12',
      }, {
        url: 'webpackEntry.js',
        revision: 'd41d8cd98f00b204e9800998ecf8427e',
      }]);
      expect(count).to.eql(2);
      expect(size).to.eql(34);
    });

    it(`should use defaults when all the required parameters, and 'maximumFileSizeToCacheInBytes' are present`, async function() {
      const options = Object.assign({
        maximumFileSizeToCacheInBytes: 10,
      }, BASE_OPTIONS);

      const {count, size, manifestEntries} = await getManifest(options);

      expect(manifestEntries).to.deep.equal([{
        url: 'webpackEntry.js',
        revision: 'd41d8cd98f00b204e9800998ecf8427e',
      }]);
      expect(count).to.eql(1);
      expect(size).to.eql(0);
    });

    it(`should use defaults when all the required parameters, and 'templatedUrls' are present`, async function() {
      const url1 = 'url1';
      const url2 = 'url2';

      const options = Object.assign({
        templatedUrls: {
          [url1]: ['**/*.html'],
          [url2]: 'string dependency',
        },
      }, BASE_OPTIONS);

      const {count, size, manifestEntries} = await getManifest(options);

      expect(manifestEntries).to.deep.equal([{
        url: 'index.html',
        revision: '3883c45b119c9d7e9ad75a1b4a4672ac',
      }, {
        url: 'page-1.html',
        revision: '544658ab25ee8762dc241e8b1c5ed96d',
      }, {
        url: 'page-2.html',
        revision: 'a3a71ce0b9b43c459cf58bd37e911b74',
      }, {
        url: 'styles/stylesheet-1.css',
        revision: '934823cbc67ccf0d67aa2a2eeb798f12',
      }, {
        url: 'styles/stylesheet-2.css',
        revision: '884f6853a4fc655e4c2dc0c0f27a227c',
      }, {
        url: 'webpackEntry.js',
        revision: 'd41d8cd98f00b204e9800998ecf8427e',
      }, {
        url: 'url1',
        revision: '69a043d97513b7015bf4bd95df3e308e',
      }, {
        url: 'url2',
        revision: 'c154bc7cdfbfbfb73e23f853bd8fcec0',
      }]);
      expect(count).to.eql(8);
      expect(size).to.eql(4790);
    });

    it(`should use defaults when all the required parameters, and 'manifestTransforms' are present`, async function() {
      // This filters out all entries unless the url property includes the string '1'.
      const transform1 = (entries) => entries.filter((entry) => {
        return entry.url.includes('1');
      });
      // This modifies all entries to prefix the url property with the string '/prefix/'.
      const transform2 = (entries) => entries.filter((entry) => {
        entry.url = `/prefix/${entry.url}`;
        return entry;
      });

      const options = Object.assign({
        manifestTransforms: [transform1, transform2],
      }, BASE_OPTIONS);

      const {count, size, manifestEntries} = await getManifest(options);

      expect(manifestEntries).to.deep.equal([{
        url: '/prefix/page-1.html',
        revision: '544658ab25ee8762dc241e8b1c5ed96d',
      }, {
        url: '/prefix/styles/stylesheet-1.css',
        revision: '934823cbc67ccf0d67aa2a2eeb798f12',
      }]);
      expect(count).to.eql(2);
      expect(size).to.eql(50);
    });
  });
});
