# Mock API Service

This is a mock API service that simulates user authentication and chat functionality without requiring a real backend server.

## Features

- **User Authentication**: Login and signup endpoints
- **Chat Functionality**: Get messages, send messages, and view chats
- **Mock Data**: Pre-populated with sample users and messages
- **Error Handling**: Proper error responses and validation

## Usage

### Import the mock API

```javascript
import { mockAPI } from '../src/services/mockAPI';
```

### Available Endpoints

#### Login
```javascript
const response = await mockAPI.login(email, password);
// Returns: { success, data, message, timestamp }
```

**Sample credentials for testing:**
- Email: `test@example.com`
- Password: `password123`

#### Signup
```javascript
const response = await mockAPI.signup(email, password, name);
// Returns: { success, data, message, timestamp }
```

#### Get User Chats
```javascript
const response = await mockAPI.getChats(userId);
// Returns: { success, data, message, timestamp }
```

#### Get Messages
```javascript
const response = await mockAPI.getMessages(userId, contactId);
// Returns: { success, data, message, timestamp }
```

#### Send Message
```javascript
const response = await mockAPI.sendMessage(senderId, receiverId, messageText);
// Returns: { success, data, message, timestamp }
```

#### Get User Profile
```javascript
const response = await mockAPI.getUserProfile(userId);
// Returns: { success, data, message, timestamp }
```

## Mock Data

### Users
- ID: 1, Email: `test@example.com`, Password: `password123`, Name: `Test User`
- ID: 2, Email: `user@example.com`, Password: `user123`, Name: `Another User`

### Messages
- Pre-populated sample messages between users
- Automatic message timestamp generation

### Chats
- Pre-populated chat list
- Automatic unread count and last message tracking

## Response Format

All API calls return the same response format:

```javascript
{
  success: boolean,        // Whether the operation was successful
  data: any,              // The response data (varies by endpoint)
  message: string,       // Success or error message
  timestamp: string      // ISO timestamp of the response
}
```

## Error Handling

The mock API includes:
- Invalid credential handling
- Duplicate email prevention for signup
- Network simulation with delay
- Proper error responses

## Testing Notes

- All API calls simulate a 1-second delay
- Mock data is reset on page refresh
- Error states are properly handled
- Console logging is included for debugging

## Integration

This mock API can be easily replaced with a real backend API by:
1. Creating a new API service file
2. Implementing the same method signatures
3. Replacing the import in the components
4. Removing the mock API service