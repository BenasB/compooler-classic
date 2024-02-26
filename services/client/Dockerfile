FROM node:lts

WORKDIR /src

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 19000

ENTRYPOINT [ "yarn", "start" ]