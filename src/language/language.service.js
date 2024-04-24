const fs = require('fs');
const path = require('path');

/**
 * Manages available languages for use in the Scrabble toolkit API as a
 * singleton. To obtain the singleton instance, use the getInstance method.
 *
 * Ensure the class is initialized by calling loadLanguages before retrieving
 * languages.
 * @class
 */
class LanguageService {
  /**
   * Represents the singleton instance of the LanguageService class.
   * @type { LanguageService | null } @private @static
   */
  static #instance = null;

  /**
  * Holds the list of available languages loaded from the data directory.
  * @type { string[] | null } @private
  */
  #availableLanguages = null;

  /**
  * Represents a private key used to control access to the private constructor
  * of the LanguageService class.
  * This symbol is used to prevent external instantiation of the class.
  * @type { Symbol } @private @static
  */
  static #PRIVATE_CONSTRUCTOR_KEY = Symbol('PRIVATE_CONSTRUCTOR_KEY');

  /**
   * Private constructor to prevent external instantiation.
   * @param { Symbol } constructorKey Private key used to control access to the
   * private constructor.
   */
  constructor (constructorKey) {
    // Prevents direct instantiation from outside the class.
    if (constructorKey !== LanguageService.#PRIVATE_CONSTRUCTOR_KEY) {
      throw new Error('Singleton class, use getInstance() method instead.');
    }
  }

  /**
   * Returns the singleton instance of LanguageService.
   * @returns { LanguageService } The singleton instance.
   */
  static getInstance () {
    // Creates a single instance if not already created.
    if (!LanguageService.#instance) {
      LanguageService.#instance =
        new LanguageService(LanguageService.#PRIVATE_CONSTRUCTOR_KEY);
    }

    // Return the singleton instance.
    return Object.freeze(LanguageService.#instance);
  }

  /**
   * Loads available languages from a specified data directory. Each
   * subdirectory in the specified directory is treated as a language.
   *
   * If forceReload is true, it reloads languages even if they have been loaded
   * before.
   * @param { string } dataDirPath The path to the data directory containing
   * language folders.
   * @param { boolean } [forceReload=true] Flag to indicate whether to force
   * reload languages.
   * @throws { Error } If the data directory is not found.
   */
  loadLanguages (dataDirPath, forceReload = false) {
    // Check if forceReload is true or if the languages have not been loaded before
    if (forceReload && this.#availableLanguages !== null) {
      return;
    }

    // Check if the specified data directory exists.
    if (!fs.existsSync(dataDirPath)) {
      throw new Error(`Data directory ${dataDirPath} not found`);
    }

    // Retrieves language folders from the data directory.
    const languageFolders = fs.readdirSync(dataDirPath)
      .filter(file => fs.statSync(path.join(dataDirPath, file)).isDirectory());

    // Assigns the retrieved language folders to availableLanguages.
    this.#availableLanguages = languageFolders;
  }

  /**
   * Gets a list of available languages.
   *
   * Prior to invoking this function, ensure that loadLanguages has been called.
   * @returns { string[] } An immutable array of language codes.
   * @throws { Error } If loadLanguages has not been called before invoking this
   * function.
   */
  getAvailableLanguages () {
    // Throws an error if loadLanguages hasn't been called before.
    if (this.#availableLanguages === null) {
      throw new Error('No languages loaded. Call loadLanguages before ' +
        'invoking getAvailableLanguages.');
    }

    // Returns an immutable array of the available languages.
    return Object.freeze(this.#availableLanguages);
  }
}

module.exports = LanguageService;
