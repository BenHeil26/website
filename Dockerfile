FROM node:latest as build

COPY . /app

WORKDIR /app

run npm ci 

RUN npm run build

FROM node:latest as app

COPY --from=build /app/build /app
COPY --from=build /app/content /app/content
COPY --from=build /app/package.json /app
COPY --from=build /app/package-lock.json /app

WORKDIR /app

RUN npm ci --omit-dev

CMD ["node", "index.js"]
