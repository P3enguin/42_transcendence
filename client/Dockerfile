FROM node:18

WORKDIR /usr/src/app/client

COPY . .
# RUN npm i -g yarn

RUN yarn install
# RUN yarn build

EXPOSE 3000

CMD [ "yarn", "dev" ]

