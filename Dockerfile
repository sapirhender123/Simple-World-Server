FROM node:14.16.1

WORKDIR /app
 
COPY package.json package.json
 
RUN npm install

COPY app.js app.js
 
CMD [ "node", "app.js", "$PORT"]