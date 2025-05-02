# Use Bun official image
FROM oven/bun:1.1.8 as base

# Create app directory
WORKDIR /app

# Copy package files
COPY bun.lock package.json ./

# Copy rest of the backend code
COPY . .

# Ensure current directory is owned by bun user (non-root)
# 'bun' user has UID=1000 inside the Bun image
USER root
RUN chown -R bun:bun /app

# Switch to non-root 'bun' user provided by the oven/bun image
USER bun

# Install dependencies
RUN bun install

RUN bun drizzle-kit generate
RUN bun drizzle-kit push

# Expose port (adjust according to your Hono server config)
EXPOSE 3000

# Start the app
CMD ["bun", "run", "dev"]
