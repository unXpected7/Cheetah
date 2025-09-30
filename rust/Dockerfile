# Build stage
FROM rust:1.78-slim AS builder

# Install system dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Cargo files
COPY Cargo.toml Cargo.lock ./

# Copy source code
COPY src/ ./src/

# Build the application
RUN cargo build --release

# Runtime stage
FROM rust:1.78-slim AS runtime

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the built binary
COPY --from=builder /app/target/release/rust /app/rust

# Copy any additional files if needed
COPY --from=builder /app/.env.example ./.env.example || true

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 3333

# Set environment variables
ENV RUST_LOG=info
ENV PORT=3333

# Run the application
CMD ["./rust"]