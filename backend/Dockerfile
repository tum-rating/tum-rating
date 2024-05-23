FROM node:18.18-alpine AS frontend-build

WORKDIR /usr/app

RUN mkdir -p /usr/app/frontend

COPY --chown=node:node package*.json ./

COPY --chown=node:node frontend/package.json ./frontend

RUN npm install

COPY --chown=node:node tsconfig*.json ./

COPY --chown=node:node frontend ./frontend

RUN npm -w frontend run build:staging

RUN npm ci --only=production && npm cache clean --force

USER node

FROM node:18.18-alpine AS backend-development

WORKDIR /usr/app

COPY --chown=node:node package.json ./

COPY --chown=node:node backend/package.json backend/package.json

COPY --chown=node:node package-lock.json ./

RUN npm i

USER node

FROM node:18.18-alpine AS backend-build

WORKDIR /usr/app

COPY --chown=node:node package.json ./

COPY --chown=node:node backend/package.json backend/package.json

COPY --chown=node:node package-lock.json ./

COPY --chown=node:node --from=backend-development /usr/app/node_modules ./node_modules

COPY --chown=node:node backend/ backend/

RUN npm run build -w backend

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

FROM node:18.18-alpine AS production

WORKDIR /usr/app

COPY --chown=node:node --from=backend-build /usr/app/node_modules ./node_modules
COPY --chown=node:node --from=backend-build /usr/app/backend/dist ./dist
COPY --chown=node:node backend/assets ./assets

# copy frontend build
RUN mkdir -p ./public
COPY --chown=node:node --from=frontend-build /usr/app/frontend/dist ./public

# TODO add mail templates

CMD [ "node", "dist/main.js" ]