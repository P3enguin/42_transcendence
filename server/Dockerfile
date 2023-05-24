FROM node:18

WORKDIR /usr/src/app/server

COPY . .
# RUN npm i -g yarn

RUN yarn install
# RUN yarn build

RUN chmod +x ./setupDB.sh
RUN mv ./setupDB.sh /usr/local/bin/setupDB.sh

EXPOSE 8000

ENTRYPOINT [ "setupDB.sh" ]
CMD [ "yarn", "start:dev" ]

