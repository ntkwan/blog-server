FROM node:22-alpine

WORKDIR /blog-server/server

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start:prod"]
