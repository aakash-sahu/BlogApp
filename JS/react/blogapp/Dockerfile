FROM node:14.5
WORKDIR /reactclient

COPY package*.json ./

RUN npm install
COPY . /reactclient

EXPOSE 3001

CMD ["npm", "start"]