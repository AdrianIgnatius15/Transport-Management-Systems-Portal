## Build staging
FROM node:26-alpine AS build

# Set workind directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy Angular source code
COPY . .
RUN npm run build -- --configuration production

## Run the application
FROM node:26-alpine

# Set the working directory
WORKDIR /app

# Copy only the server package files
COPY server/package*json ./server/

# Install server dependencies using npm ci
RUN cd server && npm install --omit=dev

# Copy built Angular app from Stage 1
COPY --from=build /app/dist/* ./server/public/

# Copy Express server code
COPY server ./server

# Expose port
EXPOSE 8080

# Start Express server
CMD ["node", "server/server.js"]