# Use Node.js 18 as the base image for the build stage
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock (if using Yarn)
COPY package.json yarn.lock ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Use Node.js 18 as the base image for the production stage
FROM node:18 AS production

# Set the working directory
WORKDIR /app

# Copy only the build artifacts from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public

# Install only production dependencies
RUN npm install --only=production

# Start the Next.js application
CMD ["npm", "start"]