# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Expose the port your app is running on (default: 4000)
EXPOSE 4000

# Command to run the app when the container starts
CMD ["npm", "start"]
