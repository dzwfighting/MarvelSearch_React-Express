# MarvelSearch_React-Express

Is a fullstack project based on React and Express/Redis, use React as font-end and use Express/Redis as backend, our backend is achieve cache data, when we search stories/characters/comics, first it will search in cache, if the search not in cache, then theproject fetch these data in url.

# install and run

## open redis

- open redis-server.exe
- redis-cli
- PING

## In api folder

- npm install
- npm start

## In client folder

- npm install
- npm start

## notice

 - must run both, api and client, otherwise it does not work properly
 - Because the api folder and client folder is connect each other, so must install all, then run together(cannot install one, and run immediately, must both install, then run)