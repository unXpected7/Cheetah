use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ComposeMessage {
    pub id: String,
    pub room_id: String,
    pub user_id: String,
    pub content: String,
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub metadata: HashMap<String, serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ComposeRoom {
    pub id: String,
    pub name: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub participants: Vec<String>,
    pub metadata: HashMap<String, serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ComposeUser {
    pub id: String,
    pub username: String,
    pub email: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub metadata: HashMap<String, serde_json::Value>,
}

pub struct ComposeService {
    messages: Vec<ComposeMessage>,
    rooms: Vec<ComposeRoom>,
    users: Vec<ComposeUser>,
}

impl ComposeService {
    pub fn new() -> Self {
        Self {
            messages: Vec::new(),
            rooms: Vec::new(),
            users: Vec::new(),
        }
    }

    pub fn add_user(&mut self, username: String, email: String) -> Result<ComposeUser, String> {
        if self.users.iter().any(|u| u.email == email) {
            return Err("User with this email already exists".to_string());
        }

        let user = ComposeUser {
            id: Uuid::new_v4().to_string(),
            username,
            email,
            created_at: chrono::Utc::now(),
            metadata: HashMap::new(),
        };

        self.users.push(user.clone());
        Ok(user)
    }

    pub fn create_room(&mut self, name: String, creator_id: String) -> Result<ComposeRoom, String> {
        if !self.users.iter().any(|u| u.id == creator_id) {
            return Err("Creator user not found".to_string());
        }

        let room = ComposeRoom {
            id: Uuid::new_v4().to_string(),
            name,
            created_at: chrono::Utc::now(),
            participants: vec![creator_id],
            metadata: HashMap::new(),
        };

        self.rooms.push(room.clone());
        Ok(room)
    }

    pub fn join_room(&mut self, room_id: &str, user_id: &str) -> Result<(), String> {
        let room = self.rooms.iter_mut()
            .find(|r| r.id == room_id)
            .ok_or("Room not found")?;

        if room.participants.contains(&user_id.to_string()) {
            return Err("User already in room".to_string());
        }

        room.participants.push(user_id.to_string());
        Ok(())
    }

    pub fn leave_room(&mut self, room_id: &str, user_id: &str) -> Result<(), String> {
        let room = self.rooms.iter_mut()
            .find(|r| r.id == room_id)
            .ok_or("Room not found")?;

        let index = room.participants.iter()
            .position(|p| p == user_id)
            .ok_or("User not in room")?;

        room.participants.remove(index);
        Ok(())
    }

    pub fn send_message(&mut self, room_id: &str, user_id: &str, content: &str) -> Result<ComposeMessage, String> {
        let room = self.rooms.iter()
            .find(|r| r.id == room_id)
            .ok_or("Room not found")?;

        if !room.participants.contains(&user_id.to_string()) {
            return Err("User not in room".to_string());
        }

        let message = ComposeMessage {
            id: Uuid::new_v4().to_string(),
            room_id: room_id.to_string(),
            user_id: user_id.to_string(),
            content: content.to_string(),
            timestamp: chrono::Utc::now(),
            metadata: HashMap::new(),
        };

        self.messages.push(message.clone());
        Ok(message)
    }

    pub fn get_room_messages(&self, room_id: &str) -> Vec<&ComposeMessage> {
        self.messages.iter()
            .filter(|m| m.room_id == room_id)
            .collect()
    }

    pub fn get_user_rooms(&self, user_id: &str) -> Vec<&ComposeRoom> {
        self.rooms.iter()
            .filter(|r| r.participants.contains(&user_id.to_string()))
            .collect()
    }

    pub fn get_room_participants(&self, room_id: &str) -> Result<Vec<String>, String> {
        let room = self.rooms.iter()
            .find(|r| r.id == room_id)
            .ok_or("Room not found")?;

        Ok(room.participants.clone())
    }

    pub fn delete_room(&mut self, room_id: &str) -> Result<(), String> {
        let index = self.rooms.iter()
            .position(|r| r.id == room_id)
            .ok_or("Room not found")?;

        self.rooms.remove(index);
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add_user() {
        let mut service = ComposeService::new();
        let user = service.add_user("test_user".to_string(), "test@example.com".to_string()).unwrap();

        assert_eq!(user.username, "test_user");
        assert_eq!(user.email, "test@example.com");
        assert!(!user.id.is_empty());
    }

    #[test]
    fn test_duplicate_user() {
        let mut service = ComposeService::new();
        service.add_user("test_user".to_string(), "test@example.com".to_string()).unwrap();

        let result = service.add_user("test_user2".to_string(), "test@example.com".to_string());
        assert!(result.is_err());
    }

    #[test]
    fn test_create_room() {
        let mut service = ComposeService::new();
        let user = service.add_user("test_user".to_string(), "test@example.com".to_string()).unwrap();
        let room = service.create_room("test_room".to_string(), user.id.clone()).unwrap();

        assert_eq!(room.name, "test_room");
        assert_eq!(room.participants, vec![user.id]);
    }

    #[test]
    fn test_join_room() {
        let mut service = ComposeService::new();
        let user1 = service.add_user("user1".to_string(), "user1@example.com".to_string()).unwrap();
        let user2 = service.add_user("user2".to_string(), "user2@example.com".to_string()).unwrap();

        let room = service.create_room("test_room".to_string(), user1.id.clone()).unwrap();
        service.join_room(&room.id, &user2.id).unwrap();

        let participants = service.get_room_participants(&room.id).unwrap();
        assert_eq!(participants.len(), 2);
    }

    #[test]
    fn test_leave_room() {
        let mut service = ComposeService::new();
        let user1 = service.add_user("user1".to_string(), "user1@example.com".to_string()).unwrap();
        let user2 = service.add_user("user2".to_string(), "user2@example.com".to_string()).unwrap();

        let room = service.create_room("test_room".to_string(), user1.id.clone()).unwrap();
        service.join_room(&room.id, &user2.id).unwrap();
        service.leave_room(&room.id, &user2.id).unwrap();

        let participants = service.get_room_participants(&room.id).unwrap();
        assert_eq!(participants.len(), 1);
    }

    #[test]
    fn test_send_message() {
        let mut service = ComposeService::new();
        let user = service.add_user("test_user".to_string(), "test@example.com".to_string()).unwrap();
        let room = service.create_room("test_room".to_string(), user.id.clone()).unwrap();

        let message = service.send_message(&room.id, &user.id, "Hello World").unwrap();

        assert_eq!(message.content, "Hello World");
        assert_eq!(message.room_id, room.id);
        assert_eq!(message.user_id, user.id);
    }

    #[test]
    fn test_get_room_messages() {
        let mut service = ComposeService::new();
        let user = service.add_user("test_user".to_string(), "test@example.com".to_string()).unwrap();
        let room = service.create_room("test_room".to_string(), user.id.clone()).unwrap();

        service.send_message(&room.id, &user.id, "Hello").unwrap();
        service.send_message(&room.id, &user.id, "World").unwrap();

        let messages = service.get_room_messages(&room.id);
        assert_eq!(messages.len(), 2);
        assert_eq!(messages[0].content, "Hello");
        assert_eq!(messages[1].content, "World");
    }

    #[test]
    fn test_get_user_rooms() {
        let mut service = ComposeService::new();
        let user1 = service.add_user("user1".to_string(), "user1@example.com".to_string()).unwrap();
        let user2 = service.add_user("user2".to_string(), "user2@example.com".to_string()).unwrap();

        let room1 = service.create_room("room1".to_string(), user1.id.clone()).unwrap();
        let room2 = service.create_room("room2".to_string(), user1.id.clone()).unwrap();

        service.join_room(&room2.id, &user2.id).unwrap();

        let user1_rooms = service.get_user_rooms(&user1.id);
        assert_eq!(user1_rooms.len(), 2);

        let user2_rooms = service.get_user_rooms(&user2.id);
        assert_eq!(user2_rooms.len(), 1);
    }

    #[test]
    fn test_delete_room() {
        let mut service = ComposeService::new();
        let user = service.add_user("test_user".to_string(), "test@example.com".to_string()).unwrap();
        let room = service.create_room("test_room".to_string(), user.id.clone()).unwrap();

        service.delete_room(&room.id).unwrap();

        let room_exists = service.rooms.iter().any(|r| r.id == room.id);
        assert!(!room_exists);
    }
}