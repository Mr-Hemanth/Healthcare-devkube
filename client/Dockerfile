# Use the official Node.js image as a base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Build the production version
RUN npm run build

# Install a simple server to serve the built files
RUN npm install -g serve

# Expose the port that the app runs on
EXPOSE 3000

# Start the application using serve instead of npm start
CMD ["serve", "-s", "build", "-l", "3000"]