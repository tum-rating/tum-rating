FROM node:18.18-alpine AS frontend-development

WORKDIR /usr/app

COPY --chown=node:node frontend/package.json ./frontend

COPY --chown=node:node package-lock.json ./

RUN npm ci

FROM node:18.18-alpine AS frontend-build

WORKDIR /usr/app

COPY --chown=node:node frontend/package.json ./

COPY --chown=node:node package-lock.json ./

COPY --chown=node:node --from=frontend-development /usr/app/node_modules ./node_modules

COPY --chown=node:node frontend/ .

RUN npm run build:staging

#czy to jest potrzebne??
RUN npm ci --only=production && npm cache clean --force

USER node

FROM node:18.18-alpine AS backend-development

WORKDIR /usr/app

COPY --chown=node:node backend/package.json ./

COPY --chown=node:node package-lock.json ./

RUN npm ci

USER node

FROM node:18.18-alpine AS backend-build

WORKDIR /usr/app

COPY --chown=node:node backend/package.json ./

COPY --chown=node:node package-lock.json ./

COPY --chown=node:node --from=backend-development /usr/app/node_modules ./node_modules

COPY --chown=node:node backend/ .

RUN npm run build

ENV NODE_ENV production

#czy to jest potrzebne??
RUN npm ci --only=production && npm cache clean --force

USER node

FROM node:18.18-alpine AS production

COPY --chown=node:node --from=backend-build /usr/app/node_modules ./node_modules
COPY --chown=node:node --from=backend-build /usr/app/dist ./dist

# copy frontend build
RUN mkdir -p ./public
COPY --chown=node:node --from=frontend-build /usr/app/dist ./public

CMD [ "node", "dist/main.js" ]