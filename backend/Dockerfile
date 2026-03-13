# ========================================
# ETAPA 1: BUILD (Compilación)
# ========================================
FROM maven:3.8-eclipse-temurin-17 AS build

# Directorio de trabajo
WORKDIR /app

# Copiar solo pom.xml primero (para aprovechar caché de Docker)
COPY pom.xml .

# Descargar dependencias (se cachea si pom.xml no cambia)
RUN mvn dependency:go-offline

# Copiar código fuente
COPY src ./src

# Compilar aplicación (saltar tests para build más rápido)
RUN mvn clean package -DskipTests

# ========================================
# ETAPA 2: RUNTIME (Ejecución)
# ========================================
FROM eclipse-temurin:17-jre-alpine

# Crear usuario no-root por seguridad
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Directorio de trabajo
WORKDIR /app

# Copiar JAR compilado desde la etapa de build
COPY --from=build /app/target/*.jar app.jar

# Puerto que expone la aplicación
EXPOSE 8080

# Comando para ejecutar
ENTRYPOINT ["java", "-jar", "app.jar"]

# ========================================