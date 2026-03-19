# Dockerfile

# Stage 1: Build dependencies
FROM node:14 AS deps
WORKDIR /app
COPY package-lock.json ./
RUN npm install --only=production

# Stage 2: Build the app
FROM node:14 AS builder
WORKDIR /app
COPY . .
RUN npm run build

# Stage 3: Runtime
FROM node:14 AS runtime
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD [ "node", "dist/index.js" ]