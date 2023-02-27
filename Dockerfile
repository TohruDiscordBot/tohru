FROM node:18-alpine3.16

WORKDIR /usr/tohru
COPY package.json package.json

RUN ["npm", "install"]

COPY . .

RUN ["npm", "run", "installConfig"]

ENV AZURE_APP_CONFIGURATION_CONNECTION_STRING=${AZURE_APP_CONFIGURATION_CONNECTION_STRING}

RUN ["npm", "run", "build"]

CMD ["npm", "start"]