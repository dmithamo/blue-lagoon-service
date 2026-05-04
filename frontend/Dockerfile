# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy the package files from the frontend directory
COPY frontend/package*.json ./

RUN npm ci

# Copy the rest of the frontend source code
COPY frontend .

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx configuration if it exists
COPY frontend/nginx.conf /etc/nginx/nginx.conf

# FIX: Correct the source path for the built files
# Angular 17+ builds usually output to dist/[project-name]/browser
COPY --from=builder /app/dist/blue-lagoon-ui/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
