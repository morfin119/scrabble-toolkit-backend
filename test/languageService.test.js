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
      const LanguageService = require('../services/LanguageService');

      // Create an instance of LanguageService
      const languageService = new LanguageService();

      // Specify an invalid data directory.
      const invalidDataDir = 'invalid/path';

      // Expect loadLanguages to throw an error with a specific message.
      expect(() => languageService.loadLanguages(invalidDataDir))
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
      const LanguageService = require('../services/LanguageService');

      // Simulate the presence of languages by creating subdirectories in the
      // temporary directory.
      const subdirectories = ['en', 'fr', 'es'];
      for (const dir of subdirectories) {
        fs.mkdirSync(path.join(tempDataDirPath, dir));
      }

      // Create an instance of LanguageService
      const languageService = new LanguageService();

      // Load languages from the temporary directory.
      languageService.loadLanguages(tempDataDirPath);

      // Get the available languages.
      const languages = languageService.getAvailableLanguages();

      // Expect the returned languages to match the subdirectories created. A
      // set is used because the order of the subdirectories may vary when read.
      expect(new Set(languages)).toEqual(new Set(subdirectories));
    });

    it('should return an empty array on an empty directory', () => {
      const LanguageService = require('../services/LanguageService');

      // Create an instance of LanguageService
      const languageService = new LanguageService();

      // Load languages from the temporary directory (which is empty).
      languageService.loadLanguages(tempDataDirPath);

      // Get the available languages.
      const languages = languageService.getAvailableLanguages();

      // Expect the returned array of languages to be empty.
      expect(languages).toEqual([]);
    });

    it('should throw and error if getAvailableLanguages is called without ' +
       'invoking loadLanguages first', () => {
      const LanguageService = require('../services/LanguageService');

      // Create an instance of LanguageService
      const languageService = new LanguageService();

      // Expect getAvailableLanguages to throw an error with a specific message.
      expect(() => languageService.getAvailableLanguages())
        .toThrowError('No languages loaded. Call loadLanguages before ' +
                      'invoking getAvailableLanguages.');
    });

    it('should return the same available languages array in multiple ' +
       'instances after loading languages in one instance', () => {
      const LanguageService = require('../services/LanguageService');

      // Simulate the presence of languages by creating subdirectories in the
      // temporary directory.
      const subdirectories = ['en', 'fr', 'es'];
      for (const dir of subdirectories) {
        fs.mkdirSync(path.join(tempDataDirPath, dir));
      }

      // Create the first instance of LanguageService.
      const languageService1 = new LanguageService();

      // Load languages from the temporary directory using the first instance.
      languageService1.loadLanguages(tempDataDirPath);

      // Create the second instance of LanguageService.
      const languageService2 = new LanguageService();

      // Get the available languages using the first instance.
      const languages1 = languageService1.getAvailableLanguages();

      // Get the available languages using the second instance.
      const languages2 = languageService2.getAvailableLanguages();

      // Assert that the available languages array is the same in both instances.
      expect(languages2).toBe(languages1);

      // Expect the returned languages to match the subdirectories created. A
      // set is used because the order of the subdirectories may vary when read.
      expect(new Set(languages1)).toEqual(new Set(subdirectories));
    });
  });
});
