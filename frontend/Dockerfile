# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

COPY frontend/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist/blue-lagoon-ui/browser /usr/share/nginx/html

EXPOSE 80

# Nginx runs in foreground so Docker can monitor the process
CMD ["nginx", "-g", "daemon off;"]
