# Clickify

A modern URL shortener with an analytics dashboard — built with Vite + React on the frontend, and Node.js + Express + Prisma (MongoDB) on the backend.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Deployment](#deployment)
4. [Prerequisites & Compatibility](#compatibility-warning)
5. [Local Development Setup](#local-setup)
6. [API Documentation](#api)
7. [Folder Structure](#folder-structure)


---

## Features

- Shorten long URLs with ease
- Generate custom aliases
- View detailed click analytics (mobile vs desktop)
- User authentication (Sign in, Sign up)
- Clean, responsive UI

---

## Tech Stack

### Frontend

- Vite + React
- TypeScript
- ShadCN UI + TailwindCSS

### Backend

- Node.js + Express
- Prisma ORM with MongoDB
- JWT for authentication
- Rate limiting
- Docker + Docker Compose

---

##  Deployment

- **Frontend**: [https://clickify-client.vercel.app](https://clickify-client.vercel.app)
- **Backend**: [https://clickify-server.vercel.app](https://clickify-server.vercel.app)

---

## Compatibility Warning


> **Requires Node.js v20+**

Some of the libraries used in the backend rely on features only available in Node.js 20 and above — such as enhanced support for native ESM modules and performance improvements.

**However**, to mitigate local version issues, the backend includes both a `Dockerfile` and `docker-compose.yml` to easily run the project in a containerized environment with compatible versions.

---

## Local Setup

###  Prerequisites

- Node.js >= 20 (if not using Docker)
- Docker + Docker Compose
- MongoDB instance URI (or use Dockerized Mongo)

---

### Clone and Setup

```bash
git clone https://github.com/Hetav21/clickify.git
cd clickify
```
### Backend
```
cd server

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Populate .env
${EDITOR} .env

# Start development server
npm run dev
```
### Frontend
```
cd client

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Populate .env
${EDITOR} .env

# Start development server
npm run dev
```
## Using Docker
Just run the following command to start the project in a containerized environment with compatible versions. **Do not forget to populate `.env` files in  `/client` and `/server`**
```
docker-compose up --build
```
###  API
API endpoints are tested using Bruno. You can find the `.bru` files under server/api-testing.
