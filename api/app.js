const express = require("express");
// const configRoutes = require("./routes");
const app = express();
const static = express.static(__dirname + "/public");
const exphbs = require("express-handlebars");
const session = require("express-session");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const redis = require("redis");
const axios = require("axios");
var cors = require("cors");
const client = redis.createClient();

app.use("/public", static);
app.use(cors());

const URL = require("../client/src/data/marvelData");

var newestPage = 0;
var newestOffset = 0;

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// configRoutes(app);

app.get("/", function (req, res, next) {
  res.render("shows/home");
});

app.get("/api", function (req, res, next) {
  res.render("shows/home");
});

app.get("/api/characters/history", async (req, res, next) => {
  try {
    let cache = (
      await client.LRANGE(`characters + ${newestPage} + ${newestOffset}`, 0, 19)
    ).map(JSON.parse);
    console.log(`in history offset=${newestOffset},new=${newestPage}`)
    cache.forEach((x) => (x.id = parseInt(x.id)));
    // res.json(cache[0]);
    res.render("shows/history", { characters: cache[0] }, async (err, html) => {
      res.send(html);
    });
  } catch (e) {
    return res.render(
      "shows/error",
      {
        error:
          "Oh, something wrong in history page, may be have not any cache in history, please search and try again",
      },
      async (err, html) => {
        res.send(html);
      }
    );
    // return res.status(404).json({
    //   error:
    //     "Oh, something wrong in history page, may be have not any cache in history, please search and try again",
    // });
  }
});

app.get("/api/characters/page/:pagenum", async (req, res, next) => {
  // if (req.originalUrl === "/api/characters/page/:pagenum") {
  // console.log(typeof req.params.pagenum);
  let page = parseInt(req.params.pagenum);
  if (page < 0) {
    return res.render(
      "shows/error",
      {
        error: "the pagenum cannot be negtative, please input a valid number",
      },
      async (err, html) => {
        res.send(html);
      }
    );
    // return res.status(404).json({
    //   error: "the pagenum cannot be negtative, please input a valid number",
    // });
  }

  console.log(`in characters/page ${page}`);
  let offset = page * 20;
  newestPage = page;
  newestOffset = offset;

  let exists = await client.exists(`characters + ${page} + ${offset}`);
  // console.log(exists);
  if (exists) {
    console.log("this page is stored in redis");
    let cache = (
      await client.LRANGE(`characters + ${page} + ${offset}`, 0, 19)
    ).map(JSON.parse);
    console.log(`in characters offset=${newestOffset},new=${newestPage}`)
    // console.log(cache[0]);
    // res.send(cache[0]);
    res.render(
      "shows/characters",
      { characters: cache[0] },
      async (err, html) => {
        res.send(html);
      }
    );
  } else {
    const {
      data: { data },
    } = await axios.get(`${URL.characterUrl}&offset=${offset}&limit=20`);
    // console.log(`${URL.characterUrl}&offset=${offset}&limit=20`);
    // console.log(data);
    if (data.results && data.results.length === 0) {
      return res.render(
        "shows/error",
        {
          error: "Cannot get any data, please try again",
        },
        async (err, html) => {
          res.send(html);
        }
      );
      // return res.json({ error: "Cannot get any data, please try again" });
    }
    // res.send(JSON.stringify(data));
    // res.send(data.results);
    await client.LPUSH(
      `characters + ${page} + ${offset}`,
      JSON.stringify(data.results)
    );
    res.render(
      "shows/characters",
      { characters: data.results },
      async (err, html) => {
        res.send(html);
      }
    );
  }

  // let detail = {
  //   totalCount: data.total,
  //   totalPages: Math.ceil(data.total / 20),
  // };

  // console.log(req.params);
  // res.send(req.params);
});

app.get("/api/comics/page/:pagenum", async (req, res, next) => {
  let page = parseInt(req.params.pagenum);
  let offset = page * 20;
  if (page < 0) {
    return res.render(
      "shows/error",
      {
        error: "The pagenum cannot be negtative, please try a valid pagenum",
      },
      async (err, html) => {
        res.send(html);
      }
    );
    // return res.status(404).json({
    //   error: "The pagenum cannot be negtative, please try a valid pagenum",
    // });
  }

  let exists = await client.exists(`comics + ${page} + ${offset}`);
  if (exists) {
    console.log("This page is exists in redis!");
    let cache = (
      await client.LRANGE(`comics + ${page} + ${offset}`, 0, 19)
    ).map(JSON.parse);
    // res.send(cache[0]);
    // console.log(cache[0]);
    res.render("shows/comics", { comics: cache[0] }, async (err, html) => {
      res.send(html);
    });
  } else {
    const {
      data: { data },
    } = await axios.get(`${URL.comicsUrl}&offset=${offset}&limit=20`);

    if (data.results && data.results.length === 0) {
      return res.render(
        "shows/error",
        {
          error:
            "Cannot get any data, please input a valid pagenum and try again",
        },
        async (err, html) => {
          res.send(html);
        }
      );
      // return res.json({
      //   error:
      //     "Cannot get any data, please input a valid pagenum and try again",
      // });
    }

    // res.send(data.results);
    res.render("shows/comics", { comics: data.results }, async (err, html) => {
      res.send(html);
    });

    await client.LPUSH(
      `comics + ${page} + ${offset}`,
      JSON.stringify(data.results)
    );
  }
});

app.get("/api/stories/page/:pagenum", async (req, res, next) => {
  // console.log(req.params);
  let page = parseInt(req.params.pagenum);
  let offset = page * 20;

  if (page < 0) {
    return res.render(
      "shows/error",
      {
        error: "The pagenum cannot be negtative, please try a valid pagenum",
      },
      async (err, html) => {
        res.send(html);
      }
    );
    // return res.status(404).json({
    //   error: "The pagenum cannot be negtative, please try a valid pagenum",
    // });
  }

  let exists = await client.exists(`stories + ${page} + ${offset}`);
  if (exists) {
    console.log("This page is exists in redis!");
    let cache = (
      await client.LRANGE(`stories + ${page} + ${offset}`, 0, 19)
    ).map(JSON.parse);
    // res.send(cache[0]);
    // console.log(cache[0]);
    res.render("shows/stories", { stories: cache[0] }, async (err, html) => {
      res.send(html);
    });
  } else {
    const {
      data: { data },
    } = await axios.get(`${URL.storiesUrl}&offset=${offset}&limit=20`);
    if (data.results && data.results.length === 0) {
      return res.render(
        "shows/error",
        {
          error: "Cannot get any data, please try again",
        },
        async (err, html) => {
          res.send(html);
        }
      );
      // return res.json({ error: "Cannot get any data, please try again" });
    }
    // res.send(data.results);
    await client.LPUSH(
      `stories + ${page} + ${offset}`,
      JSON.stringify(data.results)
    );
    res.render(
      "shows/stories",
      { stories: data.results },
      async (err, html) => {
        res.send(html);
      }
    );
  }
});

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.listen(4000, async () => {
  await client.connect();
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:4000");
});
