FROM node:18.18-alpine AS development

WORKDIR /usr/app

COPY --chown=node:node backend/package.json ./

COPY --chown=node:node package-lock.json ./

# RUN npm i -g npm@10.1.0

RUN npm ci

COPY --chown=node:node backend/ .

USER node

FROM node:18.18-alpine AS build

WORKDIR /usr/app

COPY --chown=node:node backend/package.json ./

COPY --chown=node:node package-lock.json ./

COPY --chown=node:node --from=development /usr/app/node_modules ./node_modules

COPY --chown=node:node backend/ .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

FROM node:18.18-alpine AS production

COPY --chown=node:node --from=build /usr/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/app/dist ./dist

CMD [ "node", "dist/main.js" ]