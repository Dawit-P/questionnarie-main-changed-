# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application source
COPY . .

# Build React app
RUN npm run build

# Use Nginx to serve the frontend
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Expose frontend port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
