# Use official Bun base image
FROM oven/bun:1.1.8-alpine

# Create a non-root user
RUN addgroup -S app && adduser -S -G app app

# Set working directory
WORKDIR /app

# Copy dependencies-related files first
COPY bun.lock package.json tsconfig.json ./

# Install dependencies as root to avoid permission issues
RUN bun install --frozen-lockfile

# Copy the rest of the project
COPY . .

# Fix permissions so non-root user can access all files
RUN chown -R app:app /app

# Switch to non-root user
USER app

# Expose Vite dev server port
EXPOSE 5173

# Start the Vite dev server
CMD ["bun", "run", "dev"]
