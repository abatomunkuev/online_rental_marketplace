FROM node:16.18.0-alpine3.15@sha256:9598b4e253236c8003d4e4b1acde80a6ca781fc231a7e670ecc2f3183c94ea5e AS dependencies

RUN apk add --update --no-cache g++ make python3 && ln -sf python3 /usr/bin/python

RUN apk update && apk add glib-dev vips-dev

WORKDIR /app

COPY package*.json /app/

RUN npm uninstall sharp \
  && npm ci --only=production \
  && npm install --platform=linuxmusl sharp@0.30.7

FROM node:16.18.0-alpine3.15@sha256:9598b4e253236c8003d4e4b1acde80a6ca781fc231a7e670ecc2f3183c94ea5e AS production

WORKDIR /app

COPY --from=dependencies /app/ ./

COPY ./src ./src

COPY ./views ./views

COPY ./public ./public

EXPOSE 8080:8080

CMD ["node", "src/server.js"]

