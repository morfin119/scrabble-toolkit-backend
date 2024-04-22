const path = require('path');
const LanguageService = require('../language/language.service');

/**
 * Initializes services required by the application:
 * - Load language data for the Scrabble game.
 *
 * @returns {void}
 */
function initializeServices () {
  // Get the data directory from the environment variable
  const dataDirectory = process.env.DATA_DIRECTORY || './data';

  // Construct the full path to the Scrabble data directory
  const scrabbleDataDirectory = path.join(dataDirectory, 'scrabble_data');

  // Initialize the language service
  const languageService = new LanguageService();
  languageService.loadLanguages(scrabbleDataDirectory);
}

module.exports = initializeServices;
