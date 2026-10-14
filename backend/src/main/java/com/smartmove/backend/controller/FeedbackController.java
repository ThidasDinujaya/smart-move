package com.smartmove.backend.controller;

import com.smartmove.backend.data.Feedback;
import com.smartmove.backend.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class FeedbackController {
    @Autowired
    private FeedbackService feedbackService;

    @GetMapping
    public List<Feedback> getAllFeedback(
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        return feedbackService.getAllFeedback(userId);
    }

    @GetMapping("/mine")
    public List<Feedback> getMyFeedback(@RequestHeader(name = "X-User-Id", required = false) String userId) {
        return feedbackService.getMyFeedback(userId);
    }

    @PostMapping
    public Feedback submitFeedback(
            @RequestBody Feedback feedback,
            @RequestHeader(name = "X-User-Id", required = false) String userId) {
        return feedbackService.saveFeedback(feedback, userId);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleInvalidFeedback(IllegalArgumentException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", exception.getMessage()));
    }

}
