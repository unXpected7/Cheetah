#[cfg(test)]
mod tests {
    use crate::compose::{ComposeService, ComposeMessage, ComposeRoom, ComposeUser};

    #[test]
    fn test_compose_message_creation() {
        let message = ComposeMessage {
            id: "test-id".to_string(),
            room_id: "room-123".to_string(),
            user_id: "user-123".to_string(),
            content: "Hello, World!".to_string(),
            timestamp: chrono::Utc::now(),
            metadata: std::collections::HashMap::new(),
        };

        assert_eq!(message.room_id, "room-123");
        assert_eq!(message.user_id, "user-123");
        assert_eq!(message.content, "Hello, World!");
    }

    #[test]
    fn test_compose_room_creation() {
        let room = ComposeRoom {
            id: "room-123".to_string(),
            name: "Test Room".to_string(),
            created_at: chrono::Utc::now(),
            participants: vec!["user-123".to_string()],
            metadata: std::collections::HashMap::new(),
        };

        assert_eq!(room.name, "Test Room");
        assert_eq!(room.participants.len(), 1);
        assert_eq!(room.participants[0], "user-123");
    }

    #[test]
    fn test_compose_user_creation() {
        let user = ComposeUser {
            id: "user-123".to_string(),
            username: "testuser".to_string(),
            email: "test@example.com".to_string(),
            created_at: chrono::Utc::now(),
            metadata: std::collections::HashMap::new(),
        };

        assert_eq!(user.username, "testuser");
        assert_eq!(user.email, "test@example.com");
    }

    #[tokio::test]
    async fn test_compose_service_integration() {
        let mut service = ComposeService::new();

        // Add a user
        let user1 = service.add_user("alice".to_string(), "alice@example.com".to_string())
            .expect("Failed to add user");

        let user2 = service.add_user("bob".to_string(), "bob@example.com".to_string())
            .expect("Failed to add user");

        // Create a room
        let room = service.create_room("General Chat".to_string(), user1.id.clone())
            .expect("Failed to create room");

        // Bob joins the room
        service.join_room(&room.id, &user2.id)
            .expect("Failed to join room");

        // Alice sends a message
        let message = service.send_message(&room.id, &user1.id, "Hello everyone!")
            .expect("Failed to send message");

        assert_eq!(message.content, "Hello everyone!");
        assert_eq!(message.room_id, room.id);
        assert_eq!(message.user_id, user1.id);

        // Bob sends a message
        let bob_message = service.send_message(&room.id, &user2.id, "Hi Alice!")
            .expect("Failed to send message");

        // Get all messages in the room
        let messages = service.get_room_messages(&room.id);
        assert_eq!(messages.len(), 2);

        // Get Alice's rooms
        let alice_rooms = service.get_user_rooms(&user1.id);
        assert_eq!(alice_rooms.len(), 1);

        // Get Bob's rooms
        let bob_rooms = service.get_user_rooms(&user2.id);
        assert_eq!(bob_rooms.len(), 1);

        // Bob leaves the room
        service.leave_room(&room.id, &user2.id)
            .expect("Failed to leave room");

        // Get participants after Bob leaves
        let participants = service.get_room_participants(&room.id)
            .expect("Failed to get participants");
        assert_eq!(participants.len(), 1);
        assert_eq!(participants[0], user1.id);

        // Delete the room
        service.delete_room(&room.id)
            .expect("Failed to delete room");
    }

    #[tokio::test]
    async fn test_compose_error_handling() {
        let mut service = ComposeService::new();

        // Try to create room with non-existent user
        let result = service.create_room("Test Room".to_string(), "non-existent-user".to_string());
        assert!(result.is_err());

        // Try to join non-existent room
        let user = service.add_user("test".to_string(), "test@example.com".to_string())
            .expect("Failed to add user");
        let result = service.join_room("non-existent-room", &user.id);
        assert!(result.is_err());

        // Try to send message as user not in room
        let room = service.create_room("Test Room".to_string(), user.id.clone())
            .expect("Failed to create room");
        let result = service.send_message(&room.id, "different-user", "Hello");
        assert!(result.is_err());
    }
}