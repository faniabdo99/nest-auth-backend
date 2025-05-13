# Authentication Backend

A robust authentication backend service built with NestJS, featuring JWT authentication, MongoDB integration, and comprehensive API documentation.

## Features

- 🔐 JWT-based authentication
- 📝 Input validation using class-validator
- 📚 Swagger API documentation
- 🛡️ Rate limiting with @nestjs/throttler
- 🗄️ MongoDB integration with Mongoose
- 🔒 Password hashing with bcrypt
- 🎯 TypeScript support

## Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd auth-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/auth-db
JWT_SECRET=your_jwt_secret
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:
```
http://localhost:3000/docs
```

## Available Scripts

- `npm run build` - Build the application
- `npm run start:dev` - Start the application in development mode
- `npm run start:prod` - Start the application in production mode
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run test coverage
- `npm run lint` - Lint the codebase
- `npm run format` - Format the code using Prettier

## Project Structure

```
src/
├── auth/           # Authentication module
├── guards/         # Custom guards
├── interfaces/     # TypeScript interfaces
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

## Dependencies

### Main Dependencies
- @nestjs/common
- @nestjs/config
- @nestjs/core
- @nestjs/jwt
- @nestjs/mongoose
- @nestjs/platform-express
- @nestjs/swagger
- @nestjs/throttler
- bcrypt
- class-transformer
- class-validator
- mongoose
- uuid

### Development Dependencies
- @nestjs/cli
- @nestjs/testing
- @types/* (various type definitions)
- eslint
- jest
- prettier
- typescript
