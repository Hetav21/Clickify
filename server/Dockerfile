# Use official Node Alpine image
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies first (for caching)
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the app port
EXPOSE 3000

# Start the dev server
CMD ["npm", "run", "dev"]
