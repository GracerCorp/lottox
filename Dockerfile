FROM oven/bun:1 AS base


WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN bunx prisma generate
RUN bun run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["bun", "run", "start"]