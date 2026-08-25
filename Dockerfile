FROM node :22-slim 
WORKDIR /APP
COPY package*.json ./
RUN npm ci
COPY . .
ENV PORT=5000
CMD ["node", "app.js"]

//create an image based on  this file
//docker build -t >app-name>:<tag>

//start the container based on image above
//docker run -p <local-port>:<containter-port><image-name>