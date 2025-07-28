import 'reflect-metadata';
import {Model} from 'mongoose';
import {inject, autoInjectable} from 'tsyringe';
import {IEnrichedWord} from '@components/EnrichedWord/interfaces/EnrichedWord.interface';
import {getAlphagram} from '@utils/scrabbleWordUtils';
import TileSetService from '@components/TileSet/TileSet.service';
import {ITileSet} from '@components/TileSet/interfaces/TileSet.interface';

@autoInjectable()
export default class EnrichedWordService {
  private readonly enrichedWordModel: Model<IEnrichedWord>;
  private readonly tileSetService: TileSetService;

  constructor(
    @inject('ENRICHED_WORD_MODEL') enrichedWordModel: Model<IEnrichedWord>,
    tileSetService: TileSetService
  ) {
    this.enrichedWordModel = enrichedWordModel;
    this.tileSetService = tileSetService;
  }

  /**
   * Filters an array of enriched words based on specified criteria.
   *
   * @param enrichedWords - The array of enriched words to filter.
   * @param filters - The criteria to filter the enriched words.
   * @param filters.minLength - The minimum length of the word.
   * @param filters.maxLength - The maximum length of the word.
   * @param filters.minPointValue - The minimum point value of the word.
   * @param filters.maxPointValue - The maximum point value of the word.
   * @returns The filtered array of enriched words.
   */
  filterEnrichedWords(
    enrichedWords: IEnrichedWord[],
    filters: {
      minLength?: number;
      maxLength?: number;
      minPointValue?: number;
      maxPointValue?: number;
    }
  ) {
    return enrichedWords.filter(enrichedWord => {
      if (
        filters.minLength !== undefined &&
        enrichedWord.word.length < filters.minLength
      ) {
        return false;
      }

      if (
        filters.maxLength !== undefined &&
        enrichedWord.word.length > filters.maxLength
      ) {
        return false;
      }

      if (
        filters.minPointValue !== undefined &&
        enrichedWord.value < filters.minPointValue
      ) {
        return false;
      }

      if (
        filters.maxPointValue !== undefined &&
        enrichedWord.value > filters.maxPointValue
      ) {
        return false;
      }

      return true;
    });
  }

  /**
   * Finds a word in a specific word list.
   *
   * @param word
   * The word to find.
   * @param wordListName
   * The name of the word list where to look for the word.
   * @param tileSetName
   * The name of the tile set used by the word list to enrich the words.
   * @returns
   * Promise resolving to the enriched word, or null if the word is not found.
   */
  async findWord(
    word: string,
    wordListName: string,
    tileSetName: string
  ): Promise<IEnrichedWord | null> {
    return await this.enrichedWordModel
      .findOne({
        word: word,
        wordListName: wordListName,
        tileSetName: tileSetName,
      })
      .lean()
      .exec();
  }

  /**
   * Finds anagrams of a word in a specified word list.
   *
   * @param word
   * The word to find anagrams for.
   * @param wordListName
   * The name of the word list.
   * @param tileSetName
   * The name of the tile set used by the word list to enrich the words.
   * @returns
   * Promise resolving to an array of enriched words that are anagrams of
   * the specified word.
   */
  async findAnagrams(
    word: string,
    wordListName: string,
    tileSetName: string
  ): Promise<IEnrichedWord[]> {
    const tileSet = (await this.tileSetService.findByName(
      tileSetName
    )) as ITileSet;

    const validLetters = new Set(tileSet.tiles.map(tile => tile.letter));
    const alphagram = getAlphagram(word, validLetters);

    return await this.enrichedWordModel
      .find({
        alphagram: alphagram,
        wordListName: wordListName,
        tileSetName: tileSetName,
      })
      .lean()
      .exec();
  }

  /**
   * Find all sub-anagrams of a word in a specified word list.
   *
   * @param word
   * The word to find sub-anagrams for.
   * @param wordListName
   * The name of the word list.
   * @param tileSetName
   * The name of the tile set used by the word list to enrich the words.
   * @returns
   * Promise resolving to an array of enriched words that are sub-anagrams of
   * the specified word.
   */
  async findSubAnagrams(
    word: string,
    wordListName: string,
    tileSetName: string
  ): Promise<IEnrichedWord[]> {
    let subAnagrams: IEnrichedWord[] = [];

    for (let windowSize = 1; windowSize < word.length + 1; windowSize++) {
      for (let i = 0; i < word.length - windowSize + 1; i++) {
        const subString = word.substring(i, i + windowSize);
        const anagrams = await this.findAnagrams(
          subString,
          wordListName,
          tileSetName
        );
        subAnagrams = subAnagrams.concat(anagrams);
      }
    }

    return subAnagrams;
  }

  /**
   * Find front and back hooks of a word in a specified word list.
   *
   * @param word
   * The word to find hooks for.
   * @param wordListName
   * The name of the word list.
   * @param tileSetName
   * The name of the tile set used by the word list to enrich the words.
   * @returns
   * Promise resolving to an object with the front and back hooks of a word or
   * null if the word is not found.
   */
  async findHooks(
    word: string,
    wordListName: string,
    tileSetName: string
  ): Promise<{
    frontHooks: IEnrichedWord[];
    backHooks: IEnrichedWord[];
  } | null> {
    const enrichedWord = await this.findWord(word, wordListName, tileSetName);
    if (!enrichedWord) {
      return null;
    }

    const frontHooks: IEnrichedWord[] = [];

    for (const hook of enrichedWord.frontHooks) {
      const hookWord = await this.findWord(
        hook + word,
        wordListName,
        tileSetName
      );
      if (hookWord) {
        frontHooks.push(hookWord);
      }
    }

    const backHooks: IEnrichedWord[] = [];

    for (const hook of enrichedWord.backHooks) {
      const hookWord = await this.findWord(
        word + hook,
        wordListName,
        tileSetName
      );
      if (hookWord) {
        frontHooks.push(hookWord);
      }
    }

    return {frontHooks, backHooks};
  }

  /**
   * Finds enriched words by a regex pattern in a specified word list.
   *
   * @param pattern
   * The regular expression pattern to match against words.
   * @param wordListName
   * The name of the word list.
   * @param tileSetName
   * The name of the tile set used by the word list to enrich the words.
   * @returns
   * Promise resolving to an array of enriched words matching the pattern.
   */
  async findByPattern(
    pattern: RegExp,
    wordListName: string,
    tileSetName: string
  ): Promise<IEnrichedWord[]> {
    return await this.enrichedWordModel
      .find({
        word: {$regex: pattern},
        wordListName: wordListName,
        tileSetName: tileSetName,
      })
      .lean()
      .exec();
  }

  /**
   * Find enriched words that are extensions of a given word in a specified word
   * list.
   *
   * @param word
   * The word to find extensions for.
   * @param wordListName
   * The name of the word list.
   * @param tileSetName
   * The name of the tile set used by the word list to enrich the words.
   * @returns
   * Promise resolving to an array of enriched words that are extensions of the
   * word.
   */
  async findExtensions(
    word: string,
    wordListName: string,
    tileSetName: string
  ): Promise<IEnrichedWord[]> {
    const regex = new RegExp(`.*${word}.*`, 'i');
    const patternWords = await this.findByPattern(
      regex,
      wordListName,
      tileSetName
    );

    return patternWords.filter(entry => entry.word !== word);
  }

  /**
   * Find enriched words that are anagram hooks of a given word in specified
   * word list.
   *
   * @param word
   * The word to find anagram hooks for.
   * @param wordListName
   * The name of the word list.
   * @param tileSetName
   * The name of the tile set used by the word list to erich the words.
   * @returns
   * Promise resolving to an array of enriched words that are anagram hooks of
   * the word.
   */
  async findAnagramHooks(
    word: string,
    wordListName: string,
    tileSetName: string
  ): Promise<IEnrichedWord[]> {
    const tileSet = (await this.tileSetService.findByName(
      tileSetName
    )) as ITileSet;

    const validLetters = new Set(tileSet.tiles.map(tile => tile.letter));

    let anagramHooks: IEnrichedWord[] = [];

    for (const letter of validLetters) {
      const anagrams = await this.findAnagrams(
        word + letter,
        wordListName,
        tileSetName
      );
      anagramHooks = anagramHooks.concat(anagrams);
    }

    return anagramHooks;
  }

  /**
   * Finds enriched words that are blank anagrams of a given word in a specified
   * word list.
   *
   * @param word
   * The word to find blank anagrams for.
   * @param wordListName
   * The name of the word list.
   * @param tileSetName
   * The name of the tile set used by the word list to erich the words.
   * @returns
   * Promise resolving to an array of enriched words that are blank anagrams of
   * the word.
   */
  async findBlankAnagrams(
    word: string,
    wordListName: string,
    tileSetName: string
  ) {
    const tileSet = (await this.tileSetService.findByName(
      tileSetName
    )) as ITileSet;

    const validLetters = new Set(tileSet.tiles.map(tile => tile.letter));
    const alphagram = getAlphagram(word, validLetters);

    let blankAnagrams: IEnrichedWord[] = [];

    for (let i = 0; i < alphagram.length; i++) {
      for (const letter of validLetters) {
        const modifiedAlphagram =
          alphagram.slice(0, i) + letter + alphagram.slice(i + 1);

        const anagrams = await this.findAnagrams(
          modifiedAlphagram,
          wordListName,
          tileSetName
        );
        blankAnagrams = blankAnagrams.concat(anagrams);
      }
    }

    return blankAnagrams;
  }

  /**
   * Find enriched words that match a pattern where one character in the given
   * word is replaced by any character.
   *
   * @param word
   * The word to find blank matches for.
   * @param wordListName
   * The name for the word list.
   * @param tileSetName
   * The name of the tile set used by the word list to erich the words.
   * @returns
   * Promise resolving to an array of enriched words that match the blank
   * matches pattern.
   */
  async findBlankMatches(
    word: string,
    wordListName: string,
    tileSetName: string
  ): Promise<IEnrichedWord[] | null> {
    let blankMatches: IEnrichedWord[] = [];

    for (let i = 0; i < word.length; i++) {
      const regex = new RegExp(
        `^${word.slice(0, i)}.${word.slice(i + 1)}$`,
        'i'
      );
      const patternWords = await this.findByPattern(
        regex,
        wordListName,
        tileSetName
      );
      blankMatches = blankMatches.concat(patternWords);
    }

    return blankMatches;
  }

  /**
   * Find enriched words that are transpositions of the given word.
   *
   * @param word
   * The word to find transpositions for.
   * @param wordListName
   * The name of the word list.
   * @param tileSetName
   * The name of the tile set used by the word list to erich the words.
   * @returns
   * Promise resolving to an array of enriched words that are transpositions of
   * the word.
   */
  async findTranspositions(
    word: string,
    wordListName: string,
    tileSetName: string
  ): Promise<IEnrichedWord[]> {
    const transpositions: IEnrichedWord[] = [];

    for (let i = 0; i < word.length - 1; i++) {
      const swappedWord =
        word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2);
      const transposition = await this.findWord(
        swappedWord,
        wordListName,
        tileSetName
      );

      if (!transposition) {
        continue;
      }

      transpositions.push(transposition);
    }

    return transpositions;
  }
}
