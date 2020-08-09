FROM node:14.5
WORKDIR /expressserver

COPY package*.json ./

# RUN npm cache clean
RUN npm install

COPY . /expressserver

EXPOSE 3000

CMD ["npm", "start"]