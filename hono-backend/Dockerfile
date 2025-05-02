# Use official Bun image (includes Bun, Node.js, and npm)
FROM oven/bun:1.1.8-alpine

# Create non-root user for security
RUN addgroup -S app && adduser -S -G app app

# Set working directory
WORKDIR /app

# Set non-root user
USER app

# Copy Bun-related files first to leverage caching
COPY --chown=app:app bun.lockb package.json tsconfig.json ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy remaining files (e.g., src/, public/, etc.)
COPY --chown=app:app . .

# Expose the port your Hono app listens on (default example: 3000)
EXPOSE 3000

# Start the Hono app
CMD ["bun", "start"]
