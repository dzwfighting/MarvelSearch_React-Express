const md5 = require("blueimp-md5");
const publickey = "e3d327ba2d518d30454eb5837102cd0d";
const privatekey = "1277fa9c7d469d880ba6721ecb75798a24ed3132";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public";
const characterUrl = `${baseUrl}/characters?ts=${ts}&apikey=${publickey}&hash=${hash}`;
const comicsUrl = `${baseUrl}/comics?ts=${ts}&apikey=${publickey}&hash=${hash}`;
const storiesUrl = `${baseUrl}/stories?ts=${ts}&apikey=${publickey}&hash=${hash}`;

module.exports = {
  ts,
  publickey,
  hash,
  baseUrl,
  characterUrl,
  comicsUrl,
  storiesUrl,
};
