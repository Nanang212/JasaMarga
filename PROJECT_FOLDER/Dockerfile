# # FROM node:22.14.0

# # WORKDIR /usr/app
# # COPY package*.json ./
# # RUN npm install --legacy-peer-deps
# # COPY . .
# # EXPOSE 3000

# FROM  node:22.14.0

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["npm", "start"]


# Gunakan image node.js
FROM node:20.4.0-alpine

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json dulu supaya caching lebih optimal
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua source code ke container
COPY . .

# Build aplikasi kalau ada step build
# RUN npm run build

# Expose port (optional)
EXPOSE ${PORT}

# Command untuk start aplikasi
CMD ["npm", "start"]

