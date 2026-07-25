# Use the official Bun base image
FROM oven/bun:1.2-alpine

WORKDIR /app

# Copy lockfile and package dependencies
COPY package.json bun.lockb* ./

# Install packages
RUN bun install --frozen-lockfile --production

# Copy application files
COPY . .

# Expose server port
EXPOSE 3000

# Start server
CMD ["bun", "run", "src/index.ts"]
