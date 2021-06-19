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

```

#### Use Twitter API ####
You have to create a new project in developer portal. By creating a new project you accept from Twitter your key and secret and you have to put them on the right place in the code (in the top, in the part of defining them).
In addition, you have to get into the setting of the project and add in CALLBACK URLS: http://127.0.0.1:3000/callback.


#### Running ####
##### Running the Server #####
write in the terminal
```bash
node app.js
```

##### Running the Client #####
You have to write in your browser "localhost:3000/tweets?query=USER_NAME". <br />
In user name you have to put the name of the user you want to see his 10 recent tweets (for example: nasa, LindseyStirling).

##### Running in Docker #####
Install docker-desktop from [here](https://www.docker.com/products/docker-desktop) and open it.
Write in the terminal (in the appropriate path):
```bash
docker build . -t server
docker run -p 3000:3000 server_node
```
but if you want to run the app from the docker-file again, you need to write
```bash
docker run server_node
```
