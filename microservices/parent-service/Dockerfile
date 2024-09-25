FROM openjdk:17-slim
WORKDIR /home/app
COPY target/parent-service-1.0-SNAPSHOT.jar /home/app/parent-service.jar
CMD ["java", "-jar", "parent-service.jar"]