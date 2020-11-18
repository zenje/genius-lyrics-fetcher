# genius-lyrics-fetcher
A simple node.js client that fetches song lyrics from the [**Genius API**](https://docs.genius.com/)!

## Installation

```
npm install --save genius-lyrics-fetcher
```

## Usage

Retrieve an access token from Genius: https://genius.com/developers

### Import and initialize client
```
import GeniusFetcher from 'genius-lyrics-fetcher';

const ACCESS_TOKEN = 'YOUR TOKEN HERE';
const client = new GeniusFetcher.Client(ACCESS_TOKEN);
```

### Async / await usage
```
async function getLyrics() {
  const lyrics = await client.fetch("San Francisco Street", "Sun Rai");
  return lyrics;
}
```

### .then() usage
```
client.fetch("Nanã", "Polo & Pan")
  .then(lyrics => console.log(lyrics));
```

## Methods

### `fetch(trackTitle, artistName)`

Returns a promise resolving to a string containing lyrics for `trackTitle` by `artistName`. If no lyrics are found, an `Error` will be thrown.
