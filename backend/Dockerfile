FROM openjdk:17-slim

WORKDIR /app

# Copy the gradle wrapper
COPY backend/gradle ./gradle
COPY backend/gradlew ./
COPY backend/gradlew.bat ./

# Copy build files
COPY backend/build.gradle .
COPY backend/settings.gradle .
COPY backend/src ./src

# Build the application
RUN ./gradlew bootJar --no-daemon

# Extract the jar to run it directly
RUN java -Djarmode=layertools -jar build/libs/*.jar extract

# Create a new layer for the application
FROM openjdk:17-slim

WORKDIR /app

# Copy layers from builder
COPY --from=0 app/dependencies/ ./
COPY --from=0 app/spring-boot-loader/ ./
COPY --from=0 app/snapshot-dependencies/ ./
COPY --from=0 app/application/ ./

EXPOSE 8080

# Use the org.springframework.boot.loader.JarLauncher to start
ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher"]
