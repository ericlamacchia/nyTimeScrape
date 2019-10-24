var express = require("express");
var app = express();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

var cheerio = require("cheerio");

// var Note = require("../models/Note.js");
// var Article = require("../models/Article.js");

app.get("/", function(req, res) {
  res.redirect("/articles");
});

app.get("/scrape", function (req, res) {
    axios.get("https://www.nytimes.com/search/").then(function (response) {
        var $ = cheerio.load(response.data);

        $(".css-138we14").each(function (i, element) {
            var result = {};

            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });

        res.send("Scrape Complete");
    });
});

module.exports = app;