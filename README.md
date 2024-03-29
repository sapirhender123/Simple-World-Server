# Simple-World-Server
+ ### A server in Node.js that handles the following API: ###
1. GET request "/tweets?query=TWEET_QUERY" and returns the 10 latest tweets from Twitter API according to a TWEET_QUERY.
2. GET request "GET /health" and returns json form that includes: OS name, Language/platform version, Memory usage of your machine and CPU usage of your machine.


#### Installation ####
```bash
npm install express
npm install os
npm install os-utils
npm install oauth
npm install util
npm install marked
```

#### Building in Heroku ####

```bash
heroku create <heroku-app-name>
heroku git:remote -a <heroku-app-name>
heroku config:add CALLBACK_URL=<...> TWITTER_AP_KEY=<...> TWITTER_API_SECRET_KEY=<...>
heroku stack:set container
```

#### Use Twitter API ####
You have to create a new project in developer portal. By creating a new project you accept from Twitter your key and secret and you have to put them on the right place in the code (in the top, in the part of defining them).
In addition, you have to get into the setting of the project and add in CALLBACK URLS set `http://127.0.0.1:<port>/callback` for local usage, and `https://<heroku-app-name>.herokuapp.com/callback` when working with Heroku.


#### Running The Server ####

##### Locally #####
write in the terminal
```bash
PORT=<...> CALLBACK_URL=<...> TWITTER_API_KEY=<...> TWITTER_API_SECRET_KEY=<...> node app.js
```

##### Docker #####
Install docker-desktop from [here](https://www.docker.com/products/docker-desktop) and open it.
Write in the terminal (in the appropriate path):

```bash
docker build . -t server_node
docker run -p <PORT:PORT> -e PORT=<...> -e CALLBACK_URL="<...>" -e TWITTER_API_KEY ="<...>" -e TWITTER_API_SECRET_KEY "<...>" server_node
```

##### Heroku #####
Download Heroku CLI [here](https://devcenter.heroku.com/articles/heroku-cli)

```bash
git push heroku main
heroku open
```

[link to my live API on Heroku](https://recent-tweets-2021.herokuapp.com/)

##### Running the Client #####
Locally and in the Docker, go to `localhost:<port>/`. To visit the site hosted by Heroku, visit `https://<heroku-app-name>.herokuapp.com/`.
For example, visit "/tweet?query=<username>" if you want to see the 10 recent tweets of a specific user (nasa, LindseyStirling, etc).


