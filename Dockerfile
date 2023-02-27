FROM node:18-alpine3.16

WORKDIR /usr/tohru
COPY package.json package.json

RUN ["npm", "install"]

COPY . .

RUN ["npm", "run", "installConfig"]

RUN ["npm", "run", "build"]

CMD ["npm", "start"]