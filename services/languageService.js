const fs = require('fs');
const path = require('path');

/** Array of strings representing available languages.
 * @type {Array<string>}
 */
let availableLanguages = null;

/**
 * Loads available languages from a specified data directory.
 * Each subdirectory in the specified directory is treated as a language.
 *
 * @param {string} dataDir The path to the data directory containing language folders.
 * @throws {Error} If the data directory is not found.
 */
function loadLanguages (dataDir) {
  // Check if the data directory exists.
  if (!fs.existsSync(dataDir)) {
    throw new Error(`Data directory ${dataDir} not found`);
  }

  // Read language directories and filter out non-directories.
  const languageFolders = fs.readdirSync(dataDir)
    .filter(file => fs.statSync(path.join(dataDir, file)).isDirectory());

  // Update module-level variable availableLanguages
  availableLanguages = languageFolders;
}

/**
 * Gets a list of available languages.
 * Prior to invoking this function, ensure that loadLanguages has been called
 * to populate the available languages.
 *
 * @returns {string[]} An immutable array of language codes.
 * @throws {Error} If loadLanguages has not been called before invoking this function.
 */
function getAvailableLanguages () {
  if (availableLanguages === null) {
    throw new Error('No languages loaded. Call loadLanguages before ' +
      'invoking getAvailableLanguages.');
  }
  return Object.freeze(availableLanguages);
}

module.exports = {
  loadLanguages,
  getAvailableLanguages
};