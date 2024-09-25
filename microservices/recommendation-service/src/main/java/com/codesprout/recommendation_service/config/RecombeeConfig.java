package com.codesprout.recommendation_service.config;
import com.recombee.api_client.RecombeeClient;
import com.recombee.api_client.api_requests.Request;
import com.recombee.api_client.util.Region;
import com.recombee.api_client.exceptions.ApiException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RecombeeConfig {

    @Bean
    public RecombeeClient recombeeClient() {
        return new RecombeeClient(
                "codesprout-dev",
                "wXZ9T5lfPxXtTA1143xMbP4pe12xBGlCsM2jpbBpvwkLGYmROWuPxFyVmi3DBfW2"
        ).setRegion(Region.US_WEST);
    }

    // Utility to execute Recombee requests with exception handling
    public void executeRecombeeRequest(RecombeeClient client, Request request) {
        try {
            client.send(request);
        } catch (ApiException e) {
            // Log error or handle it accordingly
            e.printStackTrace();
        }
    }
}