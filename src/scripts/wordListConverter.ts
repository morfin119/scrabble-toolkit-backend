import fs from 'fs';
import {enhanceWordList, parseTxtWordList} from '@utils/wordListUtils';

function main() {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 3) {
      throw new Error(
        'Usage: node wordListToJson.js <path_to_input_word_list> ' +
          '<path_to_output_file> <path_to_tile_set>'
      );
    }

    const [inputFilePath, outputFilePath, tilesetPath] = args;

    const text = fs.readFileSync(inputFilePath, 'utf8');
    const wordList = parseTxtWordList(text);
    const tileSet = JSON.parse(fs.readFileSync(tilesetPath, 'utf-8'));
    const enhancedWordList = enhanceWordList(wordList, tileSet);

    fs.writeFileSync(outputFilePath, JSON.stringify(enhancedWordList, null, 0));
    console.log(`Conversion complete. JSON saved to ${outputFilePath}`);
  } catch (error) {
    console.error('Error occurred during conversion:', error);
  }
}

// Run the main function if the script is executed directly
if (require.main === module) {
  main();
}
