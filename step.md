# Cheetah Project: Backend Rewrite from TypeScript to Rust

## Project Overview
The Cheetah project is a real-time chat application with frontend (Expo/Frontend) and backend services. Currently using TypeScript/Node.js backend, planning to rewrite to Rust for better performance and type safety.

## Current Architecture
- **Frontend**: Expo (React Native) + Frontend (React)
- **Backend**: TypeScript/Node.js with Express, TypeORM, Socket.IO
- **Database**: SQLite (current) → PostgreSQL (Rust target)
- **Real-time**: Socket.IO for chat functionality

## Branch: rewrite-rust ✅
Created new branch for Rust rewrite implementation.

## Current Backend Analysis (TypeScript/Node.js)

### Tech Stack
- **Framework**: Express.js
- **ORM**: TypeORM with SQLite
- **Real-time**: Socket.IO
- **Authentication**: JWT + Argon2
- **Validation**: Joi
- **Type System**: TypeScript

### Key Features Implemented
1. **User Management**
   - Registration/login with email/password
   - Profile management (nickname, avatar)
   - Authentication middleware

2. **Chat System**
   - Real-time messaging
   - Chat pagination
   - Message replies
   - File attachments

3. **Socket Events**
   - join, left, chat, writing, cancelWriting

### Entity Structure
```typescript
// User entity
- id, email, nickname, avatar, password, socketId
- created_at, updated_at

// Chat entity
- id, message, attachment, userId, replyId
- user (relation), reply (relation)
- created_at, updated_at
```

## Rust Implementation Analysis

### Current Rust Structure ✅
- **Framework**: Axum (async HTTP)
- **Real-time**: Socket.IO with socketioxide
- **Database**: SQLx with PostgreSQL
- **Authentication**: JWT + Argon2
- **Type System**: Rust strong typing

### Rust Tech Stack
- **Web Framework**: Axum 0.8.4
- **Async Runtime**: Tokio (multi-thread)
- **Database**: SQLx 0.8.6 (PostgreSQL)
- **Real-time**: Socket.IO 0.17.2
- **Authentication**: Argon2 0.5.3
- **JWT**: Custom implementation
- **CORS**: Tower-http

### Current Rust Implementation Status

#### ✅ Completed Components
1. **Database Layer** (`src/db/`)
   - Connection pooling with dependency injection
   - Models: User, Chat with proper serialization
   - PostgreSQL ready (SQLite → PostgreSQL migration)

2. **Authentication System** (`src/libs/crypto.rs`)
   - JWT generation/verification
   - Argon2 password hashing
   - Refresh token handling
   - Secure HMAC-SHA256 signatures

3. **User Management** (`src/controllers/user_controller/`)
   - User registration with avatar generation
   - User login with JWT tokens
   - Email validation
   - Password verification

4. **Avatar System** (`src/libs/avatar.rs`)
   - Multiple avatar types (identicon, personas, etc.)
   - Dicebear API integration
   - Type-safe avatar generation

5. **Basic Routing** (`src/router/`)
   - V1 API structure
   - Authentication middleware
   - CORS configuration

#### 🔧 Issues Identified in Current Rust Code

1. **Authentication Middleware** (`src/middleware/auth.rs`)
   - JWT verification logic exists but needs integration
   - Missing proper error handling

2. **Chat Controller** (`src/controllers/chat_controller/`)
   - Only pagination implemented
   - Missing real-time socket events
   - No message creation endpoint

3. **Socket.IO Implementation** (`src/main.rs`)
   - Basic ping/pong only
   - Missing chat-specific events
   - No user authentication integration

4. **Database Schema**
   - Missing user relationship definitions
   - No chat reply relationships
   - Missing proper foreign key constraints

## Recommended Improvements for Rust Implementation

### 🚀 High Priority Improvements

1. **Complete Socket.IO Integration**
   ```rust
   // Implement missing events:
   - on_join (user joins chat)
   - on_left (user leaves chat)
   - on_chat (send message)
   - on_writing (typing indicator)
   - on_cancel_writing (stop typing)
   ```

2. **Chat Endpoints**
   - POST `/api/v1/chat` - Create new message
   - GET `/api/v1/chat/{id}` - Get specific message
   - DELETE `/api/v1/chat/{id}` - Delete message
   - POST `/api/v1/chat/reply` - Reply to message

3. **User Management Enhancement**
   - PUT `/api/v1/users/profile` - Update profile
   - GET `/api/v1/users/me` - Get current user
   - POST `/api/v1/users/logout` - Logout (invalidate refresh token)

4. **Database Schema Completion**
   ```sql
   -- Add proper relationships:
   ALTER TABLE chats ADD CONSTRAINT fk_user
   FOREIGN KEY (userId) REFERENCES users(id);

   ALTER TABLE chats ADD CONSTRAINT fk_reply
   FOREIGN KEY (replyId) REFERENCES chats(id);
   ```

### 🎯 Medium Priority Improvements

1. **Error Handling Enhancement**
   - Custom error types
   - Better HTTP status codes
   - Structured error responses

2. **Validation Layer**
   - Input DTOs with validation
   - Zod-style validation patterns
   - Request size limits

3. **Security Enhancements**
   - Rate limiting
   - Input sanitization
   - CORS policy refinement

4. **Performance Optimization**
   - Query optimization
   - Connection pooling tuning
   - Caching strategies

### 🔧 Low Priority Improvements

1. **Testing**
   - Unit tests for controllers
   - Integration tests for API
   - Socket.IO event testing

2. **Monitoring**
   - Structured logging
   - Health check endpoints
   - Metrics collection

3. **Documentation**
   - API documentation
   - Code comments
   - Deployment guides

## Migration Steps: TypeScript → Rust

### Phase 1: Database Migration ✅
1. **Setup PostgreSQL**
   ```bash
   # Create database and user
   createdb cheetah
   createuser cheetah_user
   psql -c "GRANT ALL PRIVILEGES ON DATABASE cheetah TO cheetah_user"
   ```

2. **Update Database Connection**
   ```rust
   // src/db/conn.rs
   pub async fn create_connection() -> Pool<Postgres> {
     // Update with PostgreSQL connection string
   }
   ```

### Phase 2: Complete Chat System 🔧
1. **Implement Chat Endpoints**
   ```rust
   // src/controllers/chat_controller/mod.rs
   pub mod create;
   pub mod get_message;
   pub mod delete_message;
   pub mod reply_message;
   ```

2. **Add Socket.IO Events**
   ```rust
   // src/main.rs - update on_connect function
   socket.on("join", |socket, data| handle_join(socket, io, data));
   socket.on("chat", |data| handle_chat(io, data));
   // ... implement all events
   ```

3. **Update Relationships**
   ```rust
   // src/db/model.rs - add proper relationships
   #[derive(Serialize)]
   pub struct Chat {
     // ... existing fields
     pub user: Option<User>,  // Instead of Value
     pub reply: Option<Chat>, // Self-reference
   }
   ```

### Phase 3: Authentication & Security 🔧
1. **Complete JWT Middleware**
   ```rust
   // src/middleware/auth.rs
   pub async fn auth_middleware(
     State(state): State<AppState>,
     req: Request,
     next: Next,
   ) -> Result<Response, StatusCode>
   ```

2. **Add Refresh Token Rotation**
   ```rust
   // Add refresh token endpoint
   // Implement token invalidation
   // Add logout functionality
   ```

### Phase 4: Enhanced Features 🎯
1. **File Upload Support**
   ```rust
   // Add multer alternative for file uploads
   // Implement attachment storage
   // Add file validation
   ```

2. **User Profile Management**
   ```rust
   // Update profile endpoints
   // Avatar upload functionality
   // Profile validation
   ```

### Phase 5: Production Readiness 🚀
1. **Error Handling**
   ```rust
   // Create custom error types
   // Implement proper error responses
   // Add error logging
   ```

2. **Testing & Documentation**
   ```bash
   # Add test suite
   cargo test

   # Generate documentation
   cargo doc --open
   ```

## Commands for Implementation

### Database Setup
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres createdb cheetah
sudo -u postgres createuser cheetah_user
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cheetah TO cheetah_user"

# Update .env file
echo "DATABASE_URL=postgres://cheetah_user@localhost/cheetah" >> .env
```

### Rust Development
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Navigate to rust directory
cd rust

# Add dependencies to Cargo.toml if needed
cargo add serde --features derive
cargo add uuid --features v4,serde

# Run development server
cargo run

# Run tests
cargo test

# Build for production
cargo build --release
```

### Code Quality
```bash
# Format code
cargo fmt

# Check clippy
cargo clippy

# Run linting
cargo check --all
```

## Deployment Commands

### Local Development
```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Run Rust server
cd rust && cargo run

# Test API endpoints
curl http://localhost:3333/
```

### Production Deployment
```bash
# Build optimized binary
cargo build --release

# Create systemd service
sudo nano /etc/systemd/system/cheetah.service

# Reload and start
sudo systemctl daemon-reload
sudo systemctl start cheetah
sudo systemctl enable cheetah

# Check status
sudo systemctl status cheetah
```

## Conclusion

The Rust rewrite is well-structured and has a solid foundation. Key areas to complete:

1. **Immediate**: Socket.IO chat events, chat creation endpoints
2. **Short-term**: Authentication middleware integration, database relationships
3. **Long-term**: Error handling, testing, production deployment

The Rust implementation shows promise with modern async patterns, strong typing, and better performance characteristics compared to the TypeScript version.