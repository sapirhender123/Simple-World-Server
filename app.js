import express from "express";
import { cpuUsage } from "os-utils";
import { totalmem, freemem } from "os";
import { OAuth } from "oauth";
import util from "util";
import readline from "readline";
import { env } from "process";
import { readFileSync } from 'fs';
import marked from 'marked';

var server_port;
const twitter_api = "https://api.twitter.com/1.1/search/tweets.json?q=";
// Define the user key and user secret in order to do authentication with twitter servers
const _twitterConsumerKey = process.env.TWITTER_API_KEY;
const _twitterConsumerSecret = process.env.TWITTER_API_SECRET_KEY;

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const app = express();

app.get('/', function(req, res) { // handle empty request
  var path = __dirname + '\\README.md';
  var file = readFileSync(path, 'utf8');
  res.send(marked(file.toString()));
});

app.get("/health", function (req, res) {
    if (req == null) {
        // if there is no request
        return res.status(404).json;
    }

    cpuUsage(function (v) {
        var json_response = {
            "OS name": process.platform,
            "Language/platform version": process.versions.node,
            "Memory usage of your machine":
                (((totalmem() - freemem()) / totalmem()) * 100).toFixed(2) +
                "%",
            "CPU usage of your machine": (v * 100).toFixed(2) + "%",
        };

        res.send(JSON.stringify(json_response));
    });
});

// Define to the App session (session = connection process)
// Doesn't save for some reason..
// app.use(session({ resave: true, secret: "10042020", saveUninitialized: true, cookie: {secure: false}}));

var session = {
    oauthRequestToken: _twitterConsumerKey,
    oauthRequestTokenSecret: _twitterConsumerSecret,
    query: ""
}

// Create a new OAuth object for current session authentication
function consumer() {
    return new OAuth(
        "https://twitter.com/oauth/request_token", // accept request_token
        "https://twitter.com/oauth/access_token", // accept access_token
        _twitterConsumerKey,
        _twitterConsumerSecret,
        "1.0A",
        process.env.CALLBACK_URL || `http://127.0.0.1:${server_port}/callback`, // define the request to connection
        "HMAC-SHA1"
    );
}

app.get("/tweets", (req, res) => {
    // Start the An authentication process
    //const my_AccessToken = "1599059660-847IwdfE80ORKFAC0xo25MumhO1aRsisiiWlPp5"
    //const Access_Token_Secret = "yg7fquBJChUwDM20wXTLH6AC0lystPJhz2AuqCKTVrcLq"
    consumer().getOAuthRequestToken(function (
        error,
        oauthToken,
        oauthTokenSecret,
        results
    ) {
        if (error) {
            res.status(500).send(
                "Error getting OAuth request token : " + util.inspect(error))
        } else {
            // Each request need request token, request token secret from twitter
            session["oauthRequestToken"] = oauthToken; // accept request token (after approvement)
            session["oauthRequestTokenSecret"] = oauthTokenSecret; // accept request token secret (after approvement)
            session["query"] = req.query.query; // define the query to twitter
            res.redirect(
                "https://twitter.com/oauth/authorize?oauth_token=" +
                session["oauthRequestToken"]
            );
        }
    });
});

app.get("/callback", (req, res) => {
    consumer().getOAuthAccessToken( // accept access token
        session["oauthRequestToken"],
        session["oauthRequestTokenSecret"],
        req.query.oauth_verifier,
        function (error, oauthAccessToken, oauthAccessTokenSecret, results) {
            if (error) {
                res.status(500).send(
                    "Error getting OAuth access token : " +
                        util.inspect(error) +
                        "[" +
                        oauthAccessToken +
                        "]" +
                        "[" +
                        oauthAccessTokenSecret +
                        "]" +
                        "[" +
                        util.inspect(results) +
                        "]"
                );
            } else {
                session["oauthAccessToken"] = oauthAccessToken;
                session["oauthAccessTokenSecret"] = oauthAccessTokenSecret;
                // Right here is where we can run our search query!
                consumer().get(
                    twitter_api +
                        // Query string that the user provided
                        session["query"] +
                        // Limit to 10 tweets and only most recent ones
                        "&count=10&result_type=recent",
                    session["oauthAccessToken"],
                    session["oauthAccessTokenSecret"],

                    // Handle result from Twitter
                    function (error, data, response) {
                        if (error) {
                            res.status(500).send("Error: " + util.inspect(error));
                        } else {
                            res.send(data);
                        }
                    }
                );
            }
        }
    );
});

server_port = process.env.PORT || 80
app.listen(server_port, () => {
    console.log(`App listening at http://localhost:${server_port}`);
});
