# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package.json and lockfile
COPY package*.json ./

# Copy workspace configurations
COPY apps/web/package*.json apps/web/
COPY apps/api/package*.json apps/api/
COPY apps/worker/package*.json apps/worker/
COPY apps/whatsapp/package*.json apps/whatsapp/

# Install all dependencies (we need this to properly resolve workspaces)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the web workspace
RUN npm run build --workspace=apps/web

# Production Stage
FROM nginx:alpine

# Copy built React files
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# We don't copy nginx.conf here, because docker-compose mounts it as a volume.
# However, for production deployment (GHCR), we SHOULD bake it in.
# I will copy the config file to the image.
COPY nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
