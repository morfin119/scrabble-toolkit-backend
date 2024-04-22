const LanguageService = require('./language.service');

/**
 * Controller function to retrieve all available languages.
 *
 * @param {object} req The request object.
 * @param {object} res The response object.
 * @returns {object} JSON response containing available languages.
 */
async function getAvailableLanguages (req, res) {
  try {
    // Instantiate LanguageService to access language-related functionalities.
    const languageService = new LanguageService();

    // Retrieve the list of available languages.
    const languages = languageService.getAvailableLanguages();

    // Construct the response JSON object.
    const responseJson = {
      status: 'success',
      data: languages
    };

    // Send a successful response with the list of available languages.
    res.status(200).json(responseJson);
  } catch (error) {
    // Print the error to the stderr.
    console.error('Error fetching languages:', error);

    // Send an error response if languages could not be fetched.
    res.status(500).json({
      error: 'Languages could not be loaded due to a server error.'
    });
  }
}

module.exports = {
  getAvailableLanguages
};
