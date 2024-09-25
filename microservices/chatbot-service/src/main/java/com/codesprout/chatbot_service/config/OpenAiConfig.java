package com.codesprout.chatbot_service.config;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class OpenAiConfig {

    @Value("${openai.api-key}")
    private String openAiApiKey; // Inject the OpenAI API key from application.properties

    @Bean
    public OpenAiService openAiService() {
        return new OpenAiService(openAiApiKey); // Use the injected API key to create the OpenAiService bean
    }
}