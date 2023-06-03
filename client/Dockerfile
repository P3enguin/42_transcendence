FROM node:18

WORKDIR /usr/src/app/client

COPY . .

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]

