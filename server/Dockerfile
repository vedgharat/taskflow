# Build stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

# Production stage
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV PORT=5001
EXPOSE 5001

CMD ["node", "src/server.js"]
