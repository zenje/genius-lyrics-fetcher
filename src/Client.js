const axios = require("axios");
const cheerio = require("cheerio");

const SEARCH_ENDPOINT = `https://api.genius.com/search?q=`;

class Client {
  constructor(accessToken) {
    if (!accessToken) throw new Error("accessToken must be present");
    if (typeof accessToken !== "string")
      throw new Error("accessToken must be of type string");

    this.accessToken = accessToken;
  }

  fetch(trackTitle, artistName) {
    if (!trackTitle) throw new Error("trackTitle must be present");
    if (!artistName) throw new Error("artistName must be present");

    return getData(this.accessToken, getSearchEndpoint(trackTitle, artistName))
      .then((response) => response.data)
      .then((data) => findTrackUrlFromResults(data, trackTitle, artistName))
      .then(getHtml)
      .then(extractLyrics)
      .catch((err) => {
        throw new Error(
          `Unable to find track [${trackTitle}] for [${artistName}]`
        );
      });
  }
}

const getData = (accessToken, url) => {
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const getSearchEndpoint = (trackTitle, artistName) => {
  const searchTerm = `${normalize(trackTitle)} ${normalize(artistName)}`;
  // encode special characters, which need to be escaped
  return encodeURI(`${SEARCH_ENDPOINT}${searchTerm}`);
};

const normalize = (text) => {
  return text
    ? text
        .trim()
        .toLowerCase()
        .replace(/[’!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "") // remove punctuation
        .replace(/\s{2,}/g, " ") // remove any extra spaces
        .replace(/\u200B/g, "") // remove zero-width character (8203)
    : "";
};

const findTrackUrlFromResults = (results, track, artist) => {
  if (
    results &&
    results.response &&
    results.response.hits &&
    results.response.hits.length
  ) {
    const hit = results.response.hits.find((item, idx) => {
      return (
        normalize(item.result.title) === normalize(track) &&
        normalize(item.result.primary_artist.name) === normalize(artist)
      );
    });
    if (hit) {
      return hit.result.url;
    }
  }
};

const getHtml = (url) => {
  return axios.get(url).then((response) => {
    if (response.status === 200) {
      return response.data;
    }
  });
};

const extractLyrics = (html) => {
  if (html) {
    const $ = cheerio.load(html);
    const lyricsEl = $(".lyrics");
    if (lyricsEl.length) {
      const lyrics = lyricsEl.text().trim();
      return lyrics;
    }
  }
};

module.exports = Client;
