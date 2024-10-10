FROM node:18.18-alpine

WORKDIR /usr/src/app

COPY development/oidc/package*.json ./

RUN npm install

COPY development/oidc/ .

EXPOSE 3000

CMD ["node", "src/index.js"]
