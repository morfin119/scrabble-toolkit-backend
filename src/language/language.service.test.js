/* eslint-env jest */
const fs = require('fs-extra');
const path = require('path');

describe('Language Service', () => {
  // Temporary directory path for testing.
  let tempDataDirPath;

  beforeEach(() => {
    // Create a temporary directory for testing.
    tempDataDirPath = fs.mkdtempSync('scrabble_data');

    // Create language directories within the temporary directory.
    const languages = ['en', 'fr', 'es'];
    for (const language of languages) {
      fs.mkdirSync(path.join(tempDataDirPath, language));
    }

    // Reset all modules to avoid side effects between tests.
    jest.resetModules();
  });

  afterEach(() => {
    // Remove the temporary directory after testing.
    fs.rmSync(tempDataDirPath, { recursive: true });
  });

  describe('Language Service Instantiation', () => {
    it('should throw an error when trying to instantiate the class directly',
      () => {
        // Require LanguageService class.
        const LanguageService = require('./language.service');

        // Expect instantiation of LanguageService class to throw an error.
        expect(() => new LanguageService())
          .toThrow('Singleton class, use getInstance() method instead.');
      });
  });

  // Test suite for the loadLanguages function.
  describe('loadLanguages', () => {
    it('should throw an error if the data directory is not found', () => {
      // Obtain the singleton instance of LanguageService.
      const LanguageService = require('./language.service');
      const languageService = LanguageService.getInstance();

      // Specify an invalid data directory.
      const invalidDataDir = 'invalid/path';

      // Expect loadLanguages to throw an error with a specific message.
      expect(() => languageService.loadLanguages(invalidDataDir))
        .toThrow(`Data directory ${invalidDataDir} not found`);
    });
  });

  // Test suite for the getAvailableLanguages function.
  describe('getAvailableLanguages', () => {
    it('should return an array of available languages from a valid data ' +
       'directory', () => {
      // Obtain the singleton instance of LanguageService.
      const LanguageService = require('./language.service');
      const languageService = LanguageService.getInstance();

      // Load languages from the temporary directory.
      languageService.loadLanguages(tempDataDirPath);

      // Get the available languages.
      const languages = languageService.getAvailableLanguages();

      // Expect the returned languages to match the subdirectories created. A
      // set is used because the order of the subdirectories may vary when read.
      expect(new Set(languages)).toEqual(new Set(['en', 'fr', 'es']));
    });

    it('should return an empty array on an empty directory', () => {
      // Obtain the singleton instance of LanguageService.
      const LanguageService = require('./language.service');
      const languageService = LanguageService.getInstance();

      // Delete the contents of the temporary directory.
      fs.emptyDirSync(tempDataDirPath);

      // Load languages from the temporary directory (which is empty).
      languageService.loadLanguages(tempDataDirPath);

      // Get the available languages.
      const languages = languageService.getAvailableLanguages();

      // Expect the returned array of languages to be empty.
      expect(languages).toEqual([]);
    });

    it('should throw an error if getAvailableLanguages is called without ' +
       'invoking loadLanguages first', () => {
      // Obtain the singleton instance of LanguageService.
      const LanguageService = require('./language.service');
      const languageService = LanguageService.getInstance();

      // Expect getAvailableLanguages to throw an error with a specific message.
      expect(() => languageService.getAvailableLanguages())
        .toThrow('No languages loaded. Call loadLanguages before ' +
                      'invoking getAvailableLanguages.');
    });
  });
});
