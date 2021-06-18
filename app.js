import express from "express";
import { cpuUsage } from "os-utils";
import { totalmem, freemem } from "os";

const server_port = 3000;
const twitter_api = "https://api.twitter.com/1.1/search/tweets.json?q=";
const _twitterConsumerKey = "YOURTWITTERCONSUMERKEY";
const _twitterConsumerSecret = "YOURTWITTERCONSUMERSECRET";

const app = express();
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/health", function (req, res) {
    if (req == null) {
        // if there is no request
        return res.status(404).json;
    }

    cpuUsage(function (v) {
        json_response = {
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

app.get("/tweets", function (req, res) {
    if (req == null) {
        // if there is no request
        return res.status(404).json;
    }
});

app.listen(server_port, () => {
    console.log(`App listening at http://localhost:${server_port}`);
});
