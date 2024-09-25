package com.codesprout.chatbot_service.service;
;
import com.codesprout.chatbot_service.dto.ChatHistoryDTO;
import com.codesprout.chatbot_service.model.ChatHistory;
import com.codesprout.chatbot_service.repository.ChatHistoryRepository;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatBotService {


    private final ChatHistoryRepository chatHistoryRepository;


    private final OpenAiService openAiService;
    public void  greetUser(String userId,String historyId) {
        ChatHistory chatHistory = chatHistoryRepository.findById(historyId)
                .orElseGet(() -> {
                    ChatHistory newHistory = new ChatHistory();
                    newHistory.setUserId(userId);
                    newHistory.setConversations(new ArrayList<>());
                    return newHistory;
                });
        // System message to guide the GPT model behavior
        ChatHistory.Conversation newConversation = new ChatHistory.Conversation();
        newConversation.setTopic(null);
        newConversation.setConversationId(UUID.randomUUID().toString());
        newConversation.setMessages(new ArrayList<>());
        newConversation.setStartTime(LocalDateTime.now());
        ChatMessage systemMessage = new ChatMessage("system", "You are a helpful assistant of a block based gamified learning app for kids, we teach few concepts of coding like loops. Greet the user politely considering he is a kid.");


        // Create the request
        ChatCompletionRequest completionRequest = ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")  // or "gpt-4" depending on your API usage
                .messages(Arrays.asList(systemMessage))
                .maxTokens(500)
                .temperature(0.7)
                .build();

        // Get the response from the OpenAI API
        var result = openAiService.createChatCompletion(completionRequest);
        String botResponse = result.getChoices().get(0).getMessage().getContent().trim();

        // Add bot's response to conversation history
        ChatHistory.Message botMessage = new ChatHistory.Message();
        botMessage.setSender("assistant");
        botMessage.setContent(botResponse);
        botMessage.setTimestamp(LocalDateTime.now());
        newConversation.getMessages().add(botMessage);
// Add the new conversation to the user's chat history
        chatHistory.getConversations().add(newConversation);

        // Save the updated chat history with the new conversation
        chatHistoryRepository.save(chatHistory);


    }

    // Initialize or update a conversation for a user
    public void initiateChat(String userId,String historyId, String initialMessage, String conversationId) {
        // Fetch the user's chat history, or create a new one if not found
        ChatHistory chatHistory = chatHistoryRepository.findById(historyId)
                .orElseGet(() -> {
                    ChatHistory newHistory = new ChatHistory();
                    newHistory.setUserId(userId);
                    newHistory.setConversations(new ArrayList<>());
                    return newHistory;
                });
        log.info("{}",chatHistory);

        // Fetch the specific conversation by conversationId
        Optional<ChatHistory.Conversation> conversationOpt = chatHistory.getConversations()
                .stream()
                .filter(c -> c.getConversationId().equals(conversationId))
                .findFirst();

        // If conversation doesn't exist, throw an error
        ChatHistory.Conversation conversation;
        if (conversationOpt.isPresent()) {
            conversation = conversationOpt.get();
        } else {
            throw new RuntimeException("Conversation not found for conversationId: " + conversationId);
        }

        // If the topic is not set, determine it using GPT
        if (conversation.getTopic() == null) {
            // Use GPT to determine the topic based on the user's initial message
            ChatMessage systemMessageForTopic = new ChatMessage("system", "Based on the user's message, determine the topic of conversation. In response give the topic name only , no extra sentence or words except the topic name.");
            ChatMessage userMsgForTopic = new ChatMessage("user", initialMessage);

            // Request to GPT to get the topic
            ChatCompletionRequest topicRequest = ChatCompletionRequest.builder()
                    .model("gpt-3.5-turbo")
                    .messages(Arrays.asList(systemMessageForTopic, userMsgForTopic))
                    .maxTokens(500)
                    .temperature(0.7)
                    .build();

            // Fetch the topic from GPT
            var topicResult = openAiService.createChatCompletion(topicRequest);
            String detectedTopic = topicResult.getChoices().get(0).getMessage().getContent().trim();

            // Set the detected topic in the conversation
            conversation.setTopic(detectedTopic);
        }

        // Add the user's initial message to the conversation
        ChatHistory.Message userMessage = new ChatHistory.Message();
        userMessage.setSender("user");
        userMessage.setContent(initialMessage);
        userMessage.setTimestamp(LocalDateTime.now());
        conversation.getMessages().add(userMessage);

        // Now fetch the bot's response using GPT with a system message
        ChatMessage systemMessageForResponse = new ChatMessage("system",
                "You are a helpful assistant of a block-based gamified learning app for kids. " +
                        "It teaches very few concepts like loops. Respond to the user's message in an informative way. " +
                        "You understand the following programming blocks: " +
                        "1. Move: Moves an object in the x direction by a specified amount. " +
                        "2. MoveY: Moves an object in the y direction by a specified amount. " +
                        "3. Anticlockwise: Rotates an object anticlockwise by a specified angle. " +
                        "4. Clockwise: Rotates an object clockwise by a specified angle. " +
                        "5. GOTO_XY: Moves an object to a specified x and y position. " +
                        "6. Say Message: Displays a message to the user. " +
                        "7. Hide Message: Hides the displayed message. " +
                        "8. Say Message with Timer: Displays a message for a specified duration (time is the second parameter). " +
                        "9. Think Message: Represents a thought process with a message. " +
                        "10. Size: Adjusts the size of an object (size=1 is original size; other values scale up or down). " +
                        "11. Hide: Makes an object invisible. " +
                        "12. Wait: Delays execution for a specified duration in seconds. " +
                        "13. Repeat: Creates a while loop to execute a block repeatedly. " +
                        "14. Broadcast: Sends a notification to the user interface when the block is executed, taking the notification text as a parameter.");

        ChatMessage userMsgForResponse = new ChatMessage("user", initialMessage);

        // Request to GPT for the bot's response
        ChatCompletionRequest responseRequest = ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(Arrays.asList(systemMessageForResponse, userMsgForResponse))
                .maxTokens(500)
                .temperature(0.7)
                .build();

        // Fetch the response from GPT
        var responseResult = openAiService.createChatCompletion(responseRequest);
        String botResponse = responseResult.getChoices().get(0).getMessage().getContent().trim();

        // Add the bot's response to the conversation
        ChatHistory.Message botMessage = new ChatHistory.Message();
        botMessage.setSender("assistant");
        botMessage.setContent(botResponse);
        botMessage.setTimestamp(LocalDateTime.now());
        conversation.getMessages().add(botMessage);

        // Save the updated chat history (this will update the existing instance)
        chatHistoryRepository.save(chatHistory);
    }

    // Fetch all conversations by userId
    // Fetch all conversations by userId and map them to DTO
    public ChatHistoryDTO getConversationsByUserId(String userId) {
        Optional<ChatHistory> chatHistoryOpt = chatHistoryRepository.findByUserId(userId);

        if (chatHistoryOpt.isPresent()) {
            // Map existing chat history to DTO
            return mapToDTO(chatHistoryOpt.get());
        } else {
            // If no chat history exists, create a new one for the user
            ChatHistory newChatHistory = new ChatHistory();
            newChatHistory.setUserId(userId);
            newChatHistory.setConversations(new ArrayList<>()); // No conversations yet

            // Save the new chat history to the repository
            chatHistoryRepository.save(newChatHistory);


            // Return the new chat history mapped to DTO
            return ChatHistoryDTO.builder()
                    .historyId(newChatHistory.getHistoryId())
                    .userId(userId)
                    .conversations(new ArrayList<>()) // Empty list of conversations
                    .build();
        }
    }



    // Greet a user with a system message



    public String continueConversation(String historyId, String userId, String conversationId, String userMessage) {
        Optional<ChatHistory> chatHistoryOpt = chatHistoryRepository.findById(historyId);

        if (!chatHistoryOpt.isPresent()) {
            throw new RuntimeException("Chat history not found for ID: " + historyId);
        }

        ChatHistory chatHistory = chatHistoryOpt.get();

        // Find the specific conversation by conversationId
        ChatHistory.Conversation conversation = chatHistory.getConversations()
                .stream()
                .filter(c -> c.getConversationId().equals(conversationId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Conversation not found for conversationId: " + conversationId));

        // Get the last messages for context
        List<ChatHistory.Message> messages = conversation.getMessages();
        int size = messages.size();

        // System message for GPT
        ChatMessage systemMessage = new ChatMessage("system",
                "You are a helpful assistant of a block-based gamified learning app for kids. " +
                        "It teaches very few concepts like loops. Respond to the user's message in an informative way. " +
                        "You understand the following programming blocks: " +
                        "1. Move: Moves an object in the x direction by a specified amount. " +
                        "2. MoveY: Moves an object in the y direction by a specified amount. " +
                        "3. Anticlockwise: Rotates an object anticlockwise by a specified angle. " +
                        "4. Clockwise: Rotates an object clockwise by a specified angle. " +
                        "5. GOTO_XY: Moves an object to a specified x and y position. " +
                        "6. Say Message: Displays a message to the user. " +
                        "7. Hide Message: Hides the displayed message. " +
                        "8. Say Message with Timer: Displays a message for a specified duration. " +
                        "9. Think Message: Represents a thought process with a message. " +
                        "10. Size: Adjusts the size of an object. " +
                        "11. Hide: Makes an object invisible. " +
                        "12. Wait: Delays execution for a specified duration. " +
                        "13. Repeat: Creates a while loop to execute a block repeatedly. " +
                        "14. Broadcast: Sends a notification to the user interface.");

        // Retrieve the last two messages (if available)
        ChatMessage previousMessage1 = size > 0 ?
                new ChatMessage(messages.get(size - 1).getSender(), messages.get(size - 1).getContent()) : null;
        ChatMessage previousMessage2 = size > 1 ?
                new ChatMessage(messages.get(size - 2).getSender(), messages.get(size - 2).getContent()) : null;

        // Create the request to GPT with the system message, previous messages, and the new user message
        List<ChatMessage> gptMessages = new ArrayList<>(List.of(systemMessage));

        if (previousMessage2 != null) gptMessages.add(previousMessage2);
        if (previousMessage1 != null) gptMessages.add(previousMessage1);
        gptMessages.add(new ChatMessage("user", userMessage));

        // Create the GPT request
        ChatCompletionRequest completionRequest = ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(gptMessages)
                .maxTokens(500)
                .temperature(0.7)
                .build();

        // Get response from OpenAI
        var result = openAiService.createChatCompletion(completionRequest);
        String botResponse = result.getChoices().get(0).getMessage().getContent().trim();

        // Add the user's message to the conversation history
        ChatHistory.Message userMessageObj = new ChatHistory.Message();
        userMessageObj.setSender("user");
        userMessageObj.setContent(userMessage);
        userMessageObj.setTimestamp(LocalDateTime.now());
        conversation.getMessages().add(userMessageObj);

        // Add the bot's response to the conversation history
        ChatHistory.Message botMessageObj = new ChatHistory.Message();
        botMessageObj.setSender("assistant");
        botMessageObj.setContent(botResponse);
        botMessageObj.setTimestamp(LocalDateTime.now());
        conversation.getMessages().add(botMessageObj);

        // Save the updated conversation in the chat history
        chatHistoryRepository.save(chatHistory);

        // Return the bot's response
        return botResponse;
    }


    // Private mapper functions to map entity to DTO
    private ChatHistoryDTO mapToDTO(ChatHistory chatHistory) {
        return ChatHistoryDTO.builder()
                .historyId(chatHistory.getHistoryId())
                .userId(chatHistory.getUserId())
                .conversations(chatHistory.getConversations().stream()
                        .map(this::mapToConversationDTO)
                        .collect(Collectors.toList()))
                .build();
    }

    private ChatHistoryDTO.ConversationDTO mapToConversationDTO(ChatHistory.Conversation conversation) {
        return ChatHistoryDTO.ConversationDTO.builder()
                .conversationId(conversation.getConversationId())
                .topic(conversation.getTopic())
                .messages(conversation.getMessages().stream()
                        .map(this::mapToMessageDTO)
                        .collect(Collectors.toList()))
                .startTime(conversation.getStartTime())
                .endTime(conversation.getEndTime())
                .build();
    }

    private ChatHistoryDTO.MessageDTO mapToMessageDTO(ChatHistory.Message message) {
        return ChatHistoryDTO.MessageDTO.builder()

                .sender(message.getSender())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .build();
    }
}