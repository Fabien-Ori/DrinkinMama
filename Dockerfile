# Étape de build
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copie des fichiers de configuration Maven et du code source
COPY pom.xml .
COPY src ./src
COPY .mvn ./.mvn
COPY mvnw ./mvnw

# Rendre le script mvnw exécutable et builder le jar
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Étape d'exécution
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copie du jar généré depuis l'étape de build
COPY --from=build /app/target/world-recipe-api-0.0.1-SNAPSHOT.jar app.jar

# Exposer le port de l'application (8090)
EXPOSE 8090

# Commande de démarrage
ENTRYPOINT ["java", "-jar", "app.jar"]
