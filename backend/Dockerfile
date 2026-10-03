FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 8800

CMD ["npm", "start"]



#FROM node:20-alpine
#
#WORKDIR /app
#
#COPY package*.json ./
#
#RUN npm install
#
#COPY . .
#
#EXPOSE 8800
#
#CMD ["node", "index.js"]