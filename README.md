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
