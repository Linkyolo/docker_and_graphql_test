FROM node:18

WORKDIR /app

# Copy package files first to cache dependencies
COPY package.json yarn.lock* package-lock.json* ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy rest of the source code
COPY . .

# Build TypeScript to JavaScript in /dist
RUN yarn build

# Set environment to production in container
ENV NODE_ENV=production

EXPOSE 3000

# Use the compiled JS to run your app
CMD ["node", "dist/index.js"]
