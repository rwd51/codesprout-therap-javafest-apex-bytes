FROM openjdk:17-slim
WORKDIR /home/app
COPY target/chatbot-service-1.0-SNAPSHOT.jar /home/app/chatbot-service.jar
CMD ["java", "-jar", "chatbot-service.jar"]