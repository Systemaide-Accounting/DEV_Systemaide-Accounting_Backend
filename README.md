# Systemaide-Accounting Backend

## Project Overview

Systemaide-Accounting is a comprehensive web-based accounting system designed to manage financial transactions, reporting, and accounting operations. This repository contains the backend API service built with Node.js and Express, providing endpoints for various accounting functions including chart of accounts, cash transactions, sales, purchases, and general journal entries.

## Core Features

- **Authentication & Authorization**: Secure user authentication with JWT tokens and role-based access control
- **Chart of Accounts Management**: Create and manage accounting chart of accounts
- **Financial Transactions**:
  - Cash Disbursement Transactions
  - Cash Receipts Transactions
  - Sales on Account
  - Purchases on Account
  - General Journal Entries
- **Company & Agent Management**: Track company information and agent details
- **Branch & Location Management**: Manage multiple business locations and branches
- **Reporting**: Generate financial reports and statements
- **User Management**: Create and manage users with different permission levels
- **Role & Permission System**: Granular control over user access and capabilities

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) with bcrypt for password hashing
- **Security**: Helmet for HTTP header security
- **API**: RESTful API architecture
- **Encryption**: crypto-js for data encryption/decryption
- **Data Generation**: Faker.js for seeding test data

## Setup Instructions

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd DEV_Systemaide-Accounting_Backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGO_URI=mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.mongodb.net/${DB_NAME}
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=systemaide_accounting

   # JWT Secret
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d

   # Frontend URLs for CORS
   FRONTEND_URL_DEVELOPMENT_1=http://localhost:3000
   FRONTEND_URL_DEVELOPMENT_2=http://127.0.0.1:3000
   FRONTEND_URL_PRODUCTION=https://your-production-domain.com
   ```

### Running the Application

#### Development Mode

```
npm run dev
```

#### Production Mode

```
npm start
```

### Seeding Data

To populate the database with initial test data:

```
npm run seed:data
```

To clear existing data and repopulate:

```
npm run seed:data -- --clear
```

## API Endpoints

The API provides the following main endpoint groups:

- `/api/auth` - Authentication endpoints
- `/api/users` - User management
- `/api/roles` - Role management
- `/api/permissions` - Permission management
- `/api/company` - Company information
- `/api/agent` - Agent information
- `/api/chart-of-account` - Chart of accounts management
- `/api/cash-disbursement` - Cash disbursement transactions
- `/api/cash-receipts` - Cash receipt transactions
- `/api/sales-on-account` - Sales on account transactions
- `/api/purchase-on-account` - Purchase on account transactions
- `/api/general-journal` - General journal entries
- `/api/reports` - Financial reporting
- `/api/branch` - Branch management
- `/api/location` - Location management

## Configuration

The application uses environment variables for configuration. See the Setup Instructions section for the required variables.

Security features include:

- CORS protection with configured origins
- Helmet for secure HTTP headers
- JWT-based authentication
- Encrypted sensitive data
- Password hashing with bcrypt

## License

ISC

---

© 2025 Systemaide-Accounting. All Rights Reserved.
