# Systemaide-Accounting Backend: User Stories and Workflow Walkthroughs

This document provides detailed walkthrough stories for the Systemaide-Accounting Backend system. Each section outlines specific user journeys and the corresponding function-level implementation.

## Table of Contents

1. [User Authentication and Management](#user-authentication-and-management)
2. [Chart of Accounts Management](#chart-of-accounts-management)
3. [Cash Transactions](#cash-transactions)
   - [Cash Disbursements](#cash-disbursements)
   - [Cash Receipts](#cash-receipts)
4. [Credit Transactions](#credit-transactions)
   - [Sales on Account](#sales-on-account)
   - [Purchases on Account](#purchases-on-account)
5. [General Journal Entries](#general-journal-entries)
6. [Reporting](#reporting)
7. [Company and Organization Management](#company-and-organization-management)
8. [Access Control and Permissions](#access-control-and-permissions)

## User Authentication and Management

### Story: User Login

**As a** system user,  
**I want to** securely login to the accounting system,  
**So that** I can access the features and data appropriate to my role.

#### Function Walkthrough

1. **User enters credentials**: The user provides their email and password via the login form
2. **Backend validation (signIn function)**:
   - Validates that both email and password are provided
   - If validation fails, returns status 400 with specific error messages
3. **User lookup and authentication**:
   - Finds the user by email (excluding blocked users)
   - Compares the provided password with the stored hash using bcrypt
   - If authentication fails, returns status 400 with "Invalid credentials" message
4. **Session creation and permissions loading**:
   - Retrieves the user's role and associated permissions
   - Generates a JWT token signed with `JWT_SECRET` containing the user's ID and email
   - Returns user object (without sensitive data), permissions, and token

```javascript
// Implementation in auth.controller.js
export const signIn = async (req, res, next) => {
	try {
		// Email and password validation
		// Authentication logic
		// JWT token generation
		// Response with user data and token
	} catch (error) {
		next(error);
	}
};
```

### Story: User Account Management

**As an** administrator,  
**I want to** create, view, update, and manage user accounts,  
**So that** I can control who has access to the system and what they can do.

#### Function Walkthrough

1. **Create new user (createUser function)**:

   - Checks if the email is already registered
   - Validates password strength (uppercase, lowercase, number, special character)
   - Hashes the password using bcrypt with a salt
   - Creates the user record in the database

2. **View user listing (getAllUsers function)**:

   - Retrieves all non-blocked users
   - Excludes password data from the results
   - Returns a list of active users

3. **View specific user (getUserById function)**:

   - Validates the user ID format
   - Retrieves the specified user if they exist and aren't blocked
   - Returns the user data without password information

4. **Update user (updateUser function)**:

   - Validates the user ID format
   - If password is updated, rehashes it with a new salt
   - Updates the user record with new information
   - Returns the updated user data

5. **Block/Unblock user (blockUser/unblockUser functions)**:
   - Sets the user status to "blocked" or "inactive"
   - Records the timestamp of the action
   - Prevents blocked users from authenticating

## Chart of Accounts Management

### Story: Managing the Chart of Accounts

**As an** accountant,  
**I want to** create, organize, and maintain a hierarchical chart of accounts,  
**So that** I can properly categorize financial transactions for the organization.

#### Function Walkthrough

1. **View account hierarchy (getAllParentAccounts function)**:

   - Retrieves all top-level parent accounts (accounts with no parent)
   - Recursively populates all child accounts for each parent account
   - Returns a complete hierarchical structure of accounts

2. **Create new account (createAccount function)**:

   - Validates that the account code doesn't already exist
   - Creates the account with appropriate parent-child relationships
   - Updates subaccounts references if provided

3. **Add child account to parent (addChildAccount function)**:

   - Validates the parent account exists and isn't deleted
   - Creates a new child account with reference to its parent
   - Updates the parent's subAccounts list to include the new child

4. **Update account information (updateAccount function)**:

   - Validates account exists and isn't deleted
   - Checks that the updated account code doesn't conflict with existing ones
   - Updates the account record
   - Maintains parent-child relationships

5. **Delete/Restore account (deleteAccount/restoreAccount functions)**:
   - Soft-deletes an account by setting isDeleted flag
   - Records deletion timestamp
   - Allows restoration of deleted accounts

```javascript
// Implementation in chartOfAccount.controller.js
export const getAllParentAccounts = async (req, res, next) => {
	try {
		// Find top-level parent accounts (not deleted)
		// Recursively populate subAccounts for each top-level parent
		// Return hierarchical account structure
	} catch (error) {
		next(error);
	}
};

export const addChildAccount = async (req, res, next) => {
	try {
		// Validate parent account
		// Create child account with parent reference
		// Update parent's subAccounts array
	} catch (error) {
		next(error);
	}
};
```

## Cash Transactions

### Story: Cash Disbursements Management

**As an** accountant,  
**I want to** record and manage cash disbursements (payments),  
**So that** I can track all outgoing cash transactions and maintain accurate financial records.

#### Function Walkthrough

1. **Create cash disbursement (createCashDisbursementTransaction function)**:

   - Collects payment details (payee, amount, date, purpose, etc.)
   - Encrypts sensitive data like tax identification numbers (TIN)
   - Records the transaction in the database

2. **View all disbursements (getAllCashDisbursementTransactions function)**:

   - Retrieves non-deleted cash disbursement transactions
   - Populates related entities (location, payee, cash account)
   - Decrypts sensitive data for display

3. **View specific disbursement (getCashDisbursementTransactionById function)**:

   - Validates transaction ID format
   - Retrieves and populates the transaction if not deleted
   - Decrypts sensitive data for display

4. **Update disbursement (updateCashDisbursementTransaction function)**:

   - Validates transaction exists and isn't deleted
   - Updates transaction details
   - Re-encrypts sensitive data if changed

5. **Delete/Restore disbursement (deleteCashDisbursementTransaction/restoreCashDisbursementTransaction functions)**:
   - Soft-deletes by setting isDeleted flag and timestamp
   - Allows for transaction restoration when needed

```javascript
// Implementation in cashDisbursementTransaction.controller.js
export const createCashDisbursementTransaction = async (req, res, next) => {
	try {
		// Process transaction data
		// Encrypt sensitive data (TIN)
		// Create transaction record
		// Return created transaction with decrypted data for display
	} catch (error) {
		next(error);
	}
};
```

### Story: Cash Receipts Management

**As an** accountant,  
**I want to** record and manage cash receipts,  
**So that** I can track all incoming cash transactions and maintain accurate financial records.

#### Function Walkthrough

_Similar flow to Cash Disbursements, with functions for creating, viewing, updating, and managing cash receipt transactions_

## Credit Transactions

### Story: Sales on Account Management

**As an** accountant,  
**I want to** record sales made on credit (accounts receivable),  
**So that** I can track amounts owed to the business and manage customer credit.

#### Function Walkthrough

_Details functions for managing sales made on credit, including customer account management_

### Story: Purchases on Account Management

**As an** accountant,  
**I want to** record purchases made on credit (accounts payable),  
**So that** I can track amounts the business owes to vendors and manage payments.

#### Function Walkthrough

_Details functions for managing purchases made on credit, including vendor account management_

## General Journal Entries

### Story: Recording General Journal Entries

**As an** accountant,  
**I want to** create manual journal entries,  
**So that** I can record transactions that don't fit into standard categories or make accounting adjustments.

#### Function Walkthrough

1. **Create journal entry functions**:

   - Validates debits and credits balance
   - Records the entry with appropriate metadata
   - Links to relevant accounts in the chart of accounts

2. **View/update/delete journal entries functions**:
   - Standard CRUD operations with appropriate validations
   - Maintains audit trail of changes

## Reporting

### Story: Financial Reporting

**As an** accountant or financial manager,  
**I want to** generate financial reports,  
**So that** I can analyze financial performance and prepare statements.

#### Function Walkthrough

1. **Generate reports functions**:
   - Collects and aggregates transaction data
   - Calculates relevant financial metrics
   - Formats data for display or export

## Company and Organization Management

### Story: Managing Company Information

**As an** administrator,  
**I want to** maintain company information and structure,  
**So that** accounting records are properly associated with organizational entities.

#### Function Walkthrough

1. **Company information management functions**:
   - CRUD operations for company details
   - Branch and location management
   - Agent information handling

## Access Control and Permissions

### Story: Role-Based Access Control

**As an** administrator,  
**I want to** define roles and assign permissions,  
**So that** users have appropriate access levels to system features.

#### Function Walkthrough

1. **Permission management functions**:

   - Create and manage granular permissions
   - Associate permissions with roles

2. **Role management functions**:

   - Create and manage roles
   - Assign collections of permissions to roles

3. **Middleware for access control (auth.middleware.js, permission.middleware.js)**:
   - Validates user authentication via JWT
   - Checks user permissions for requested operations
   - Blocks unauthorized access to protected resources

```javascript
// Authentication middleware
export const protect = async (req, res, next) => {
	try {
		// Verify token from headers
		// Retrieve user from database
		// Add user to request object
		// Allow request to proceed
	} catch (error) {
		// Handle unauthorized access
	}
};

// Permission checking middleware
export const checkPermission = (permissionName) => {
	return (req, res, next) => {
		// Check if user has required permission
		// Allow or deny access accordingly
	};
};
```

---

This document provides a high-level walkthrough of key user journeys and their corresponding function implementations in the Systemaide-Accounting Backend. For more detailed technical information, refer to the specific controller and model files in the codebase.

Last updated: April 30, 2025
