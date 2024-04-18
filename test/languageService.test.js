/* eslint-env jest */
const fs = require('fs');
const path = require('path');

describe('Language Service', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  // Test suite for loadLanguages function.
  describe('loadLanguages', () => {
    it('should throw and error if the data directory is not found', () => {
      const { loadLanguages } = require('../services/languageService');

      // Specify an invalid data directory.
      const invalidDataDir = 'invalid/path';

      // Expect loadLanguages to throw an error with a specific message.
      expect(() => loadLanguages(invalidDataDir))
        .toThrowError(`Data directory ${invalidDataDir} not found`);
    });
  });

  // Test suite for getAvailableLanguages function
  describe('getAvailableLanguages', () => {
    // Temporary directory path for testing.
    let tempDataDirPath;

    beforeEach(() => {
      // Create a temporary directory for testing.
      tempDataDirPath = fs.mkdtempSync('scrabble_data');
    });

    afterEach(() => {
      // Remove the temporary directory after testing.
      fs.rmSync(tempDataDirPath, { recursive: true });
    });

    it('should return an array of available languages from a valid data ' +
       'directory', () => {
      const {
        loadLanguages,
        getAvailableLanguages
      } = require('../services/languageService');

      // Simulate the presence of languages by creating subdirectories in the
      // temporary directory.
      const subdirectories = ['en', 'fr', 'es'];
      for (const dir of subdirectories) {
        fs.mkdirSync(path.join(tempDataDirPath, dir));
      }

      // Load languages from the temporary directory.
      loadLanguages(tempDataDirPath);

      // Get the available languages.
      const languages = getAvailableLanguages();

      // Expect the returned languages to match the subdirectories created. A
      // set is used because the order of the subdirectories may vary when read.
      expect(new Set(languages)).toEqual(new Set(subdirectories));
    });

    it('should return an empty array on an empty directory', () => {
      const {
        loadLanguages,
        getAvailableLanguages
      } = require('../services/languageService');

      // Load languages from the temporary directory (which is empty).
      loadLanguages(tempDataDirPath);

      // Get the available languages.
      const languages = getAvailableLanguages();

      // Expect the returned array of languages to be empty.
      expect(languages).toEqual([]);
    });

    it('should throw and error if getAvailableLanguages is called without ' +
       'invoking loadLanguages first', () => {
      const { getAvailableLanguages } = require('../services/languageService');

      // Expect getAvailableLanguages to throw an error with a specific message.
      expect(() => getAvailableLanguages())
        .toThrowError('No languages loaded. Call loadLanguages before ' +
                      'invoking getAvailableLanguages.');
    });
  });
});
