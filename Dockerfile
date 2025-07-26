FROM node:18

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./
RUN yarn install

COPY . .

EXPOSE 3000

CMD yarn build && yarn migration:run && yarn dev
