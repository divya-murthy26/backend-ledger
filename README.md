# Banking Transaction System

A production-level banking transaction system built with Node.js, Express.js, MongoDB, and Mongoose. The application is designed to handle secure financial transactions while maintaining data consistency, reliability, and auditability through a ledger-based accounting architecture.

## 🚀 Features

### 🔐 User Authentication & Security

* Secure user registration and login.
* JWT (JSON Web Token) based authentication.
* Password hashing using bcrypt.
* Cookie-based session management.
* Protected API routes and authorization middleware.

### 💰 Transaction Management

* Process debit and credit transactions securely.
* Account status validation before transaction execution.
* Idempotency support to prevent duplicate transactions and accidental double payments.
* Transaction tracking with unique identifiers.

### 📒 Ledger-Based Accounting

* Implements a ledger model as the single source of truth.
* Maintains an immutable history of all financial transactions.
* Complete audit trail for every debit and credit operation.
* Ensures transparency and traceability of account activities.

### 📊 Real-Time Balance Calculation

* Uses MongoDB Aggregation Pipelines to derive account balances.
* Calculates balances by aggregating ledger entries rather than storing mutable balances.
* Improves consistency and reduces risks of data corruption.

### 🔄 Database Transactions

* Uses Mongoose Transactions for atomic operations.
* Ensures all related database updates either succeed together or roll back completely.
* Prevents partial updates during fund transfers.
* Maintains data integrity across multiple collections.

### 📧 Email Notifications

* Integrated with Nodemailer and Google OAuth2.
* Sends registration confirmation emails.
* Generates transactional alerts for account activities.
* Improves user awareness and security.

### 🌐 RESTful API Architecture

* Well-structured REST APIs for:

  * User Authentication
  * Transaction Processing
  * Balance Retrieval
  * Account Management
  * Logout Operations
* Scalable and maintainable backend design.

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JWT (JSON Web Tokens)
* bcrypt
* Cookie Parser

### Email Services

* Nodemailer
* Google OAuth2




Developed as a secure and scalable banking transaction backend system focusing on financial integrity, transaction consistency, and production-grade architecture.
