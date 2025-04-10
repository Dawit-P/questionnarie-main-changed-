# Use Node.js base image
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install
RUN npm install socket.io-client
RUN npm install socket.io

# Copy application source
COPY . .

# Build React app
RUN npm run build

# Use Nginx to serve the frontend
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose frontend port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]