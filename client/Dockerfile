FROM node:18

WORKDIR /usr/src/app/client

COPY . .
# RUN npm i -g yarn

RUN yarn install
# RUN yarn build

EXPOSE 3001

CMD [ "yarn", "dev" ]

