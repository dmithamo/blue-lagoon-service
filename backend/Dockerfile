# Stage 1: Build the application
FROM eclipse-temurin:25-jdk-alpine AS builder
WORKDIR /app

# Copy the gradle wrapper and configuration files from the backend directory
# Note: These paths assume you are building from the root of the monorepo
COPY backend/gradle ./gradle
COPY backend/gradlew ./
COPY backend/gradlew.bat ./
COPY backend/build.gradle .
COPY backend/settings.gradle .

# Copy the source code
COPY backend/src ./src

# Build the application
# Using --no-daemon is recommended for Docker builds to save memory
RUN ./gradlew bootJar --no-daemon

# Stage 2: Create the runtime image
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Copy the built JAR file from the builder stage
# We use a wildcard to grab the generated JAR and rename it to app.jar for simplicity
COPY --from=builder /app/build/libs/*.jar app.jar

# Cloud Run listens on 8080 by default
EXPOSE 8080

# Run the application using the standard JAR execution
ENTRYPOINT ["java", "-jar", "app.jar"]
