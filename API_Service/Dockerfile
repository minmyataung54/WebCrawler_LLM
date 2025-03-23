# Use Node.js as base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 8080 (required for Cloud Run)
EXPOSE 8080

# Start the app
CMD ["node", "server.js"]
