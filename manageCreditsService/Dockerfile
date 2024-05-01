# Use a base image with Node.js pre-installed
FROM node:19.4.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port on which the microservice will listen
EXPOSE 4004

# Start the microservice
CMD ["npm", "run", "start"]