

FROM node:bullseye-slim

WORKDIR /usr/src/pushr 

COPY ./package.json .

RUN yarn install 

COPY . . 

EXPOSE 3000

CMD ["yarn","start"]

