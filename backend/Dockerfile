FROM node:16.14-alpine AS development

WORKDIR /usr/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

FROM node:16.14-alpine AS build

WORKDIR /usr/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

FROM node:16.14-alpine AS production

COPY --chown=node:node --from=build /usr/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/app/dist ./dist

CMD [ "node", "dist/main.js" ]