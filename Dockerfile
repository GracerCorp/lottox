# Dockerfile

# Stage 1: Build dependencies
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --production

# Stage 2: Build the app
FROM oven/bun:1 AS builder
WORKDIR /app
COPY . .
RUN bun run build

# Stage 3: Runtime
FROM oven/bun:1 AS runtime
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD [ "bun", "dist/index.js" ]