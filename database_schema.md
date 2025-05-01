# Systemaide-Accounting Database Schema

This document outlines the database schema for the Systemaide-Accounting system. Each collection's schema is detailed with field types, validations, and relationships to other collections.

## Users Collection

Users who interact with the accounting system.

```javascript
User {
  firstName: String,         // required, max 28 chars, trimmed
  lastName: String,          // required, max 28 chars, trimmed
  middleInitial: String,     // optional, max 2 chars, trimmed
  email: String,             // required, unique, email format validation
  password: String,          // required, min 8 chars, requires uppercase, lowercase, number, special char
  role: String,              // required, enum: ["regular", "manager", "admin", "sysadmin"], default: "regular"
  status: String,            // required, enum: ["active", "inactive", "blocked"], default: "inactive"
  blockedAt: Date,           // optional, timestamp when user was blocked
  timestamps: true           // createdAt, updatedAt automatically added
}
```

## Permissions Collection

Individual permissions that can be assigned to roles.

```javascript
Permission {
  name: String,              // required, trimmed, unique permission identifier
  description: String,       // optional, trimmed, human-readable description
  timestamps: true           // createdAt, updatedAt automatically added
}
```

## Roles Collection

Role definitions with associated permissions.

```javascript
Role {
  name: String,              // required, unique, enum: ["regular", "manager", "admin", "sysadmin"]
  permissions: [             // array of references to Permission documents
    {
      type: ObjectId,
      ref: "Permission"
    }
  ],
  timestamps: true           // createdAt, updatedAt automatically added
}
```

## Chart of Accounts Collection

Hierarchical chart of accounts structure.

```javascript
ChartOfAccount {
  accountCode: String,       // required, max 20 chars, trimmed
  accountName: String,       // required, max 255 chars, trimmed
  accountType: String,       // optional, enum: ["asset", "liability", "equity", "revenue", "expense"]
  normalBalance: String,     // optional, enum: ["debit", "credit"]
  parentAccount: [           // array of references to parent ChartOfAccount documents
    {
      type: ObjectId,
      ref: "ChartOfAccount"
    }
  ],
  subAccounts: [             // array of references to child ChartOfAccount documents
    {
      type: ObjectId,
      ref: "ChartOfAccount"
    }
  ],
  isDeleted: Boolean,        // default: false
  deletedAt: Date,           // optional, timestamp when account was deleted
  timestamps: true           // createdAt, updatedAt automatically added
}
```

## Company Information Collection

Details about the company using the accounting system.

```javascript
CompanyInfo {
  name: String,              // required, max 100 chars, trimmed
  address: String,           // optional, max 200 chars, trimmed
  contactNo: String,         // optional, max 20 chars, trimmed
  email: String,             // optional, email format validation
  website: String,           // optional, URL format validation
  tin: String,               // optional, Tax Identification Number (encrypted)
  logo: String,              // optional, URL to company logo
  fiscalYear: {              // optional, fiscal year start/end dates
    start: Date,
    end: Date
  },
  timestamps: true           // createdAt, updatedAt automatically added
}
```

## Location Collection

Physical locations or branches for the company.

```javascript
Location {
  name: String,              // required, max 100 chars, trimmed
  address: String,           // optional, max 200 chars, trimmed
  contactNo: String,         // optional, max 20 chars, trimmed
  email: String,             // optional, email format validation
  isHeadOffice: Boolean,     // optional, default: false
  isActive: Boolean,         // optional, default: true
  isDeleted: Boolean,        // default: false
  deletedAt: Date,           // optional, timestamp when location was deleted
  timestamps: true           // createdAt, updatedAt automatically added
}
```

## Branch Collection

Business branches operating under the company.

```javascript
Branch {
  name: String,              // required, max 100 chars, trimmed
  code: String,              // required, max 20 chars, trimmed
  location: {                // reference to Location
    type: ObjectId,
    ref: "Location"
  },
  manager: String,           // optional, branch manager name
  isActive: Boolean,         // optional, default: true
  isDeleted: Boolean,        // default: false
  deletedAt: Date,           // optional, timestamp when branch was deleted
  timestamps: true           // createdAt, updatedAt automatically added
}
```

## Agent Information Collection

External entities like customers, suppliers, or vendors.

```javascript
AgentInfo {
  name: String,              // required, max 100 chars, trimmed
  type: String,              // required, enum: ["customer", "supplier", "vendor", "employee", "other"]
  address: String,           // optional, max 200 chars, trimmed
  contactNo: String,         // optional, max 20 chars, trimmed
  email: String,             // optional, email format validation
  tin: String,               // optional, Tax Identification Number (encrypted)
  isActive: Boolean,         // optional, default: true
  isDeleted: Boolean,        // default: false
  deletedAt: Date,           // optional, timestamp when agent was deleted
  timestamps: true           // createdAt, updatedAt automatically added
}
```

## Cash Disbursement Transaction Collection

Records of cash payments made by the company.

```javascript
CashDisbursementTransaction {
  date: Date,                // required, transaction date
  month: String,             // required, month of transaction
  year: String,              // required, year of transaction
  location: {                // required, reference to Location
    type: ObjectId,
    ref: "Location"
  },
  cvNo: String,              // required, check voucher number, max 50 chars
  checkNo: String,           // required, check number
  payeeName: {               // required, reference to AgentInfo (payee)
    type: ObjectId,
    ref: "AgentInfo"
  },
  address: String,           // required, payee address, max 255 chars
  tin: String,               // required, Tax Identification Number (encrypted), max 255 chars
  cashAccount: {             // required, reference to ChartOfAccount
    type: ObjectId,
    ref: "ChartOfAccount"
  },
  particular: String,        // required, transaction description, max 255 chars
  transactionLines: String,  // optional, serialized details of transaction lines
  isDeleted: Boolean,        // default: false
  deletedAt: Date,           // optional, timestamp when transaction was deleted
  timestamps: true           // createdAt, updatedAt automatically added
}
```

## Cash Receipts Transaction Collection

Records of cash received by the company.

```javascript
CashReceiptsTransaction {
  date: Date,                // required, transaction date
  month: String,             // required, month of transaction
  year: String,              // required, year of transaction
  location: {                // required, reference to Location
    type: ObjectId,
    ref: "Location"
  },
  orNo: String,              // required, official receipt number, max 50 chars
  receivedFrom: {            // required, reference to AgentInfo (payer)
    type: ObjectId,
    ref: "AgentInfo"
  },
  address: String,           // required, payer address, max 255 chars
  tin: String,               // required, Tax Identification Number (encrypted), max 255 chars
  cashAccount: {             // required, reference to ChartOfAccount
    type: ObjectId,
    ref: "ChartOfAccount"
  },
  particular: String,        // required, transaction description, max 255 chars
  transactionLines: String,  // optional, serialized details of transaction lines
  isDeleted: Boolean,        // default: false
  deletedAt: Date,           // optional, timestamp when transaction was deleted
  timestamps: true           // createdAt, updatedAt automatically added
}
```

## Sales on Account Collection

Credit sales transactions made by the company.

```javascript
SalesOnAccount {
  date: Date,                // required, transaction date
  month: String,             // required, month of transaction
  year: String,              // required, year of transaction
  location: {                // required, reference to Location
    type: ObjectId,
    ref: "Location"
  },
  invoiceNo: String,         // required, invoice number, max 50 chars
  soldTo: {                  // required, reference to AgentInfo (customer)
    type: ObjectId,
    ref: "AgentInfo"
  },
  address: String,           // required, customer address, max 255 chars
  tin: String,               // required, Tax Identification Number (encrypted), max 255 chars
  accountReceivable: {       // required, reference to ChartOfAccount
    type: ObjectId,
    ref: "ChartOfAccount"
  },
  particular: String,        // required, transaction description, max 255 chars
  transactionLines: String,  // optional, serialized details of transaction lines
  isDeleted: Boolean,        // default: false
  deletedAt: Date,           // optional, timestamp when transaction was deleted
  timestamps: true           // createdAt, updatedAt automatically added
}
```

## Purchase on Account Transaction Collection

Credit purchase transactions made by the company.

```javascript
PurchaseOnAccountTransaction {
  date: Date,                // required, transaction date
  month: String,             // required, month of transaction
  year: String,              // required, year of transaction
  location: {                // required, reference to Location
    type: ObjectId,
    ref: "Location"
  },
  invoiceNo: String,         // required, supplier invoice number, max 50 chars
  purchasedFrom: {           // required, reference to AgentInfo (supplier)
    type: ObjectId,
    ref: "AgentInfo"
  },
  address: String,           // required, supplier address, max 255 chars
  tin: String,               // required, Tax Identification Number (encrypted), max 255 chars
  accountPayable: {          // required, reference to ChartOfAccount
    type: ObjectId,
    ref: "ChartOfAccount"
  },
  particular: String,        // required, transaction description, max 255 chars
  transactionLines: String,  // optional, serialized details of transaction lines
  isDeleted: Boolean,        // default: false
  deletedAt: Date,           // optional, timestamp when transaction was deleted
  timestamps: true           // createdAt, updatedAt automatically added
}
```

## General Journal Collection

Records of manual journal entries.

```javascript
GeneralJournal {
  date: Date,                // required, transaction date
  month: String,             // required, month of transaction
  year: String,              // required, year of transaction
  location: {                // required, reference to Location
    type: ObjectId,
    ref: "Location"
  },
  journalNo: String,         // required, journal entry number, max 50 chars
  particular: String,        // required, transaction description, max 255 chars
  transactionLines: String,  // optional, serialized details of debit and credit entries
  isDeleted: Boolean,        // default: false
  deletedAt: Date,           // optional, timestamp when journal entry was deleted
  timestamps: true           // createdAt, updatedAt automatically added
}
```

## Database Relationships

### User-Role Relationship

- One-to-many relationship: A user has one role, but a role can be assigned to multiple users
- The role field in User references the name field in Role

### Role-Permission Relationship

- Many-to-many relationship: A role can have multiple permissions, and a permission can be assigned to multiple roles
- Implemented via an array of Permission references in the Role schema

### Chart of Accounts Hierarchical Structure

- Self-referential many-to-many relationship: An account can have multiple parent accounts and multiple child accounts
- Implemented via parentAccount and subAccounts arrays in the ChartOfAccount schema

### Transaction Relationships

- Location references: All transactions reference a Location
- Agent references: Transactions reference AgentInfo for external parties (payees, payers, customers, suppliers)
- Account references: Transactions reference appropriate ChartOfAccount entries for the financial accounts affected

## Data Security Features

- Password hashing: User passwords are hashed using bcrypt before storage
- TIN encryption: Tax Identification Numbers are encrypted in the database and decrypted when accessed
- Soft deletes: Most entities use isDeleted flag rather than permanent deletion to maintain data integrity and audit trail

## Initialization Logic

- Default sysadmin user is created on first system startup
- Default permissions are created on first system startup
- Default sysadmin role with all permissions is created on first system startup

Last Updated: April 30, 2025
