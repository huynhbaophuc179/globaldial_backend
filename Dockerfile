# FROM node

# WORKDIR /usr/src/app

# ARG NODE_ENV
# ENV NODE_ENV $NODE_ENV

# COPY package*.json /usr/src/app/
# RUN npm install

# COPY . /usr/src/app

# ENV PORT 8000
# EXPOSE $PORT
# CMD [ "npm", "start" ]
FROM node

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT 8000
EXPOSE $PORT
CMD [ "node", "./bin/www" ]
