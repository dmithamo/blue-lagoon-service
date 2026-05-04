# Stage 1: Build the application
FROM eclipse-temurin:25-jdk-alpine AS builder
WORKDIR /app

# Copy the gradle wrapper and configuration files from the backend directory
# Note: We copy the specific wrapper folder to ensure the path exists
COPY backend/gradle/wrapper ./gradle/wrapper
COPY backend/gradlew ./
COPY backend/gradlew.bat ./
COPY backend/build.gradle ./
COPY backend/settings.gradle ./

# Copy the source code
COPY backend/src ./src

# Build the application
# Use chmod to ensure the wrapper is executable in the Linux container
RUN chmod +x ./gradlew && ./gradlew bootJar --no-daemon

# Stage 2: Create the runtime image
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Copy the built JAR file from the builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

# Cloud Run listens on 8080 by default
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
