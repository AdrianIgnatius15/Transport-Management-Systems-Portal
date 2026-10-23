## Build staging
FROM node:alpine AS build

# Set workind directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy Angular source code
COPY . .
RUN npm run build -- --configuration production

## Run the application
FROM nginx:alpine

# Copy the Angular browser build to NGINX's document root
COPY --from=build /app/dist/tms-portal/browser/ /usr/share/nginx/html/

# Configure NGINX to listen on the container port used by Compose
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]