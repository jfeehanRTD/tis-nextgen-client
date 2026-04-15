# Stage 1: Build the React app
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies first (layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:1.27-alpine

# Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy nginx config as template (envsubst at startup)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy built app
COPY --from=build /app/dist /usr/share/nginx/html

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
