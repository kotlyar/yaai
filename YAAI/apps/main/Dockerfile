FROM alpine:3.21.3 AS base
RUN apk add --update nginx nodejs
WORKDIR /opt

FROM base AS npm
RUN apk add npm

FROM npm AS dev
WORKDIR /opt/apps/main
COPY ./apps/main/dev.conf /etc/nginx/http.d/default.conf
CMD ["/bin/sh", "-c", "nginx; ./migrations/migrate.mjs; [-d 'node_modules'] && npm start || npm install && npm start"]

FROM npm AS build
COPY ./modules ./modules
COPY ./public ./public
COPY ./apps/main ./apps/main
COPY ./package.json ./
RUN npm install esbuild@0.24.0
WORKDIR /opt/apps/main
RUN npm install --omit=optional --omit=dev

FROM build AS esbuild
RUN npm install --omit=optional
WORKDIR /opt
RUN node ./apps/main/esbuild.mjs
WORKDIR /opt/builds/apps/main
RUN cat /opt/apps/main/node_modules/markdown-it/dist/markdown-it.min.js > app.js
COPY ./public/images/favicon.ico ./
RUN gzip -k *

FROM base AS prod
COPY --from=esbuild /opt/builds ./builds
COPY --from=build /opt/apps/main/node_modules ./apps/main/node_modules
COPY ./modules ./apps/main/modules
COPY ./apps/main/api ./apps/main/api
COPY ./apps/main/migrations ./apps/main/migrations
COPY ./apps/main/routes ./apps/main/routes
COPY ./apps/main/views ./apps/main/views
COPY ./apps/main/package.json ./apps/main/
COPY ./apps/main/server.mjs ./apps/main/
COPY ./apps/main/prod.conf /etc/nginx/http.d/default.conf
WORKDIR /opt/apps/main
CMD ["/bin/sh", "-c", "nginx; ./migrations/migrate.mjs; ENV=prod node --experimental-sqlite ./server.mjs"]