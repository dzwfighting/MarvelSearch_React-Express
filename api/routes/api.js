const express = require("express");
const router = express.Router();
const redis = require("redis");
const client = redis.createClient();
const axios = require("axios");
// const api = require("../data/api");
const URL = require("../../src/data/marvelData");

client.connect().then(() => {});

router.get("/characters/page/:pagenum", async (req, res) => {
  try {
    let page = parseInt(req.params.pagenum);
    let offset = page * 20;
    const {
      data: { data },
    } = await axios.get(`${URL.characterUrl}&offset=${offset}&limit=20`);
    // console.log(data);
    if (data.results && data.results.length === 0) {
      return res.json({ error: "Cannot get any data, please try again" });
    }
    let detail = {
      totalCount: data.total,
      totalPages: Math.ceil(data.total / 20),
    };

    // console.log(detail);
  } catch (e) {
    return res
      .status(404)
      .json({ error: "Cannot find this page, please try again" });
  }
});

module.exports = router;
