# Scrabble toolkit (backend)

## 📝 Description
This project is the backend of a Scrabble toolkit, inspired by NASPA Zyzzyva. It is designed to help Scrabble enthusiasts search for words, analyze moves, and study optimal Scrabble strategies.

### 🌍 Multilingual & Scalable
The backend is designed for multilingual support and easy scaling. It allows for:
* Custom word lists in different languages
* Configurable tile distributions per language or variant
  ([Wikipedia](https://en.wikipedia.org/wiki/Scrabble_letter_distributions))

⚠️ Note: Official word lists (e.g., TWL, CSW) are not included in this repository due to copyright restrictions. Users must supply their own lexicons.

## 🚀 Try It Out
Curious how the API works? You can explore and interact with it right now using the built-in OpenAPI UI:

👉 [Try the API on Render](https://scrabble-toolkit-backend.onrender.com/api-docs/)

## 🧱 Tech Stack
* Express – HTTP server for API routing
* TypeScript – Type-safe
* tsyringe – Dependency injection
* OpenAPI – Interactive API documentation

## 🔍 Supported Search Features
You can query the backend for a variety of word-related data. Here’s what’s currently supported:
- [x] __Word Search__ – Check word validity
- [ ] __Find Anagrams__ – Rearranged letters that form valid words ([Wiktionary](https://en.wiktionary.org/wiki/anagram))
- [ ] __Find Subanagrams__ – Valid words using a subset of given letters
- [ ] __Find Front Hooks__ - Letters that can be added to the beginning of a word to form another word ([www.scrabbleplayers.org](https://www.scrabbleplayers.org/w/Glossary#F))
- [ ] __Find back Hooks__ - Letters that can be added to the end of a word to form another word ([www.scrabbleplayers.org](https://www.scrabbleplayers.org/w/Glossary#B))
- [ ] __Find by Pattern__ - Use `?` or `.` as wildcards
- [ ] __Find Extensions__ - Words that contain the given word as a substring
- [ ] __Find Anagram Hooks__ - Anagrams formed by adding one letter
- [ ] __Find Blank Anagrams__ - A word which is an anagram of another but for the substitution of a single letter ([Wiktionary](https://en.wiktionary.org/wiki/blanagram))
- [ ] __Find Blank Matches__ - Words formed by replacing letters with blanks
- [ ] __Find Transpositions__ Words formed by swapping two adjacent letters

## 🛠️ Installation
To get started with the project:
1. Clone the repository
```
git clone https://github.com/yourusername/scrabble-backend.git
cd scrabble-toolkit-backend
```
2. Install dependencies
```
npm install
```
3. Set environment variables
Please set the following environment variables before running the server:
* MONGODB_URI – your MongoDB connection string
* PORT - the port number the server should listen on (optional, defaults to 3000)
5. Run the server
```
npm start
```
## 📄 DB Preparation & Word List Enrichment
To load playable word data into the backend, you need to enrich a raw word list and export it as a structured CSV file ready for database import.

### 📋 Input Word List Format
The input must be a plain text file (.txt) with one word per line, optionally followed by a definition:
```
APPLE A common, firm, round fruit produced by a tree of the genus Malus.
BAT Any of the flying mammals of the order Chiroptera, usually small and nocturnal, insectivorous or frugivorous.
QUIZ A competition in the answering of questions.
```
Each line:
* Starts with a word (no spaces)
* Optionally includes a definition after the first space

### 🧩 Tile Set Format (JSON)
The tile set defines the score and distribution of each letter. Here's an example:

📁 ENGLISH_STANDARD.json
```
{
  "name": "ENGLISH_STANDARD",
  "language": "en",
  "tiles": [
    { "letter": "A", "points": 1, "count": 9 },
    { "letter": "B", "points": 3, "count": 2 },
    { "letter": "C", "points": 3, "count": 2 },
    ...
    { "letter": "_", "points": 0, "count": 2 }
  ]
}
```
### 🚀 Enriching the Word List
To generate an enriched CSV:
1. Ensure dependencies are installed
```
npm install
```
2. Run the enrichment script
```
npx ts-node src/scripts/enrichWordList.ts <wordListPath> <tileSetPath> <outputPath>
```
Example:
```
npx ts-node src/scriptsenrichWordList.ts ./data/NWL2023.txt ./data/ENGLISH_STANDARD.json ./output/NWL2023.csv
```
### ✅ Next Steps
Once the enriched CSV is generated, you can:
* ✅ Import it into your database (e.g., MongoDB)
* ✅ Use it as the primary word source for the API
* ✅ Don't forget to import the tile set JSON into your database too


