package com.codesprout.chatbot_service.controller;

import com.codesprout.chatbot_service.dto.ChatHistoryDTO;
import com.codesprout.chatbot_service.dto.GreetChatDTO;
import com.codesprout.chatbot_service.dto.InitiateChatDTO;
import com.codesprout.chatbot_service.service.ChatBotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatBotService chatBotService;

    // Endpoint to greet a user and start a new conversation
    @PostMapping("/greet")
    public String greetUser(@RequestBody GreetChatDTO greetChatDTO) {
        chatBotService.greetUser(greetChatDTO.getUserId(),greetChatDTO.getHistoryId());
        return "Greeting sent to user: " + greetChatDTO.getUserId();
    }

    // Endpoint to initialize a new conversation with a given user message
    @PostMapping("/initiate")
    public String initiateChat(@RequestBody InitiateChatDTO initiateChatDTO) {
        chatBotService.initiateChat(initiateChatDTO.getUserId(), initiateChatDTO.getHistoryId(),initiateChatDTO.getInitialMessage(), initiateChatDTO.getConversationId());
        return "Conversation initiated for user: " + initiateChatDTO.getInitialMessage() + " with conversation ID: " + initiateChatDTO.getConversationId();
    }


    // Endpoint to continue an ongoing conversation
    @PostMapping("/continue")
    public String continueConversation(@RequestBody InitiateChatDTO initiateChatDTO) {
        chatBotService.continueConversation(initiateChatDTO.getHistoryId(),initiateChatDTO.getUserId(), initiateChatDTO.getConversationId(),initiateChatDTO.getInitialMessage());
        return "Message processed for user: " + initiateChatDTO.getUserId() + " in conversation ID: " + initiateChatDTO.getConversationId();
    }

    // Endpoint to fetch all conversations for a given userId
    @GetMapping("/history/{userId}")
    public ResponseEntity<ChatHistoryDTO> getConversationsByUserId(@PathVariable String userId) {
        // Fetch chat history (or empty DTO if no conversations exist)
        ChatHistoryDTO chatHistoryDTO = chatBotService.getConversationsByUserId(userId);

        return ResponseEntity.ok(chatHistoryDTO);  // Always return 200 OK with the DTO
    }

}