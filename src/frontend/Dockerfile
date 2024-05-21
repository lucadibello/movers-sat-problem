#
# This dockerfile will host the frontend of the application, created with react-create-app.
#

# Stage 1: Build the application
FROM node:18-bullseye-slim AS builder

# Set the working directory
WORKDIR /app

# Install Bun
RUN apt-get update && apt-get install -y curl unzip
RUN curl https://bun.sh/install | bash && ln -s /root/.bun/bin/bun /usr/local/bin/bun

# Copy the app's source code
COPY . .

# Install dependencies
RUN bun install

# Build the React application
RUN bun run build

# Install serve
RUN npm install -g serve

# Serve the application
CMD ["serve", "-s", "build", "-l", "1456"]
