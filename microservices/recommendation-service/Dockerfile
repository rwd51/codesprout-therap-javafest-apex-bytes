FROM openjdk:17-slim
WORKDIR /home/app
COPY target/recommendation-service-1.0-SNAPSHOT.jar /home/app/recommendation-service.jar
CMD ["java", "-jar", "recommendation-service.jar"]