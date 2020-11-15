class Client {
  constructor(apiKey) {
    if (!apiKey) throw new Error("Client requires apiKey");

    this.apiKey = apiKey;
  }

  fetch(trackTitle, artistName) {
    console.log(`fetching ${trackTitle}, ${artistName}`);
  }
}
