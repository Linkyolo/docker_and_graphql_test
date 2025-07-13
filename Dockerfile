FROM node:18

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./

ENV NODE_ENV=development

RUN yarn install || npm install

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]
