FROM node:18-alpine3.16

WORKDIR /usr/tohru
COPY packages.json packages.json

RUN ["npm", "install"]

COPY . .

RUN ["npm", "run", "build"]

CMD ["npm", "start"]