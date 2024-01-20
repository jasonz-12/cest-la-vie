# Use the official Node.js 14 image as a parent image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# If you are building your code for production
# RUN npm ci --only=production

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 8080

# Run the specified command within the container.
CMD ["node", "app.js"]