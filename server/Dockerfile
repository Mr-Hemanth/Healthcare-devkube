# Use a lightweight Node.js Alpine image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Install dependencies
# Copy package.json and install only production dependencies to keep the image small
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy the entire backend codebase to the container
COPY --chown=nodejs:nodejs . .

# Switch to non-root user
USER nodejs

# Expose the port your app runs on
EXPOSE 5002

# Start the backend server
CMD ["node", "server.js"]
