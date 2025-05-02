# Use official Bun base image (includes Bun, Node.js, and npm)
FROM oven/bun:1.1.8-alpine

# Create a non-root user for running the app
RUN addgroup -S app && adduser -S -G app app

# Set working directory
WORKDIR /app

# Switch to non-root user for security
USER app

# Copy only lockfile and package.json first to cache deps
COPY --chown=app:app bun.lockb package.json tsconfig.json ./

# Install dependencies (cached unless package files change)
RUN bun install --frozen-lockfile

# Copy the rest of the files (e.g. src/, public/)
COPY --chown=app:app . .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server (adjust if you use a custom script or port)
CMD ["bun", "run", "dev"]
