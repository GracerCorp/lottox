FROM oven/bun:1 AS base

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

WORKDIR /app
COPY package.json bun.lockb* ./
COPY prisma ./prisma/

RUN bun install

COPY . .
RUN bunx prisma generate
RUN bun run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "start"]