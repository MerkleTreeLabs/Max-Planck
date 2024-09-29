# Database

Updated Database Schema with Separate Lookup Table for Authentication Types

## Users Table (`users`)

Stores unique user information, including a unique username used across the app for identification.

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255),
  password_hash VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields**:

- `id`: Unique identifier for each user.
- `username`: Unique username (e.g., @fr1t2) used as a universal identifier.
- `email`: User's email address (if applicable).
- `password_hash`: Hashed password (if supporting direct authentication).
- `created_at`: Timestamp when the user was created.
- `updated_at`: Timestamp when the user was last updated.


## Services Table (`services`)

Defines the various platforms or services that users can connect to.

```sql
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);
```

**Fields**:

- `id`: Unique identifier for the service.
- `name`: Name of the service (e.g., 'discord', 'twitter').

## Authentication Types Table (`auth_types`)

Stores the different types of authentication methods supported.

```sql
CREATE TABLE auth_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);
```
**Fields**:

- `id`: Unique identifier for the authentication type.
- `name`: Name of the authentication type (e.g., 'oauth2', 'oauth1', 'api_key', 'sso', 'password').


## Authentication Providers Table (`authentication_providers`)

Stores information about each authentication provider or method.

```sql
CREATE TABLE authentication_providers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_id INT NOT NULL,
  auth_type_id INT NOT NULL,
  client_id VARCHAR(255),
  client_secret VARCHAR(255),
  auth_url VARCHAR(255),
  token_url VARCHAR(255),
  scopes VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  FOREIGN KEY (auth_type_id) REFERENCES auth_types(id)
);
```

Fields:

- `id`: Unique identifier.
- `service_id`: References services.id.
- `auth_type_id`: References auth_types.id.
- `client_id`: Client ID for OAuth providers.
- `client_secret`: Client secret for OAuth providers.
- `auth_url`: Authorization URL.
- `token_url`: Token exchange URL.
- `scopes`: Permissions requested.
- `created_at`: Timestamp when the record was created.
- `updated_at`: Timestamp when the record was last updated.


## User Authentications Table (user_authentications)

Associates users with their authentication methods.

```sql
CREATE TABLE user_authentications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  provider_id INT NOT NULL,
  provider_user_id VARCHAR(255),
  access_token VARCHAR(255),
  refresh_token VARCHAR(255),
  token_expiry DATETIME,
  additional_data JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (provider_id) REFERENCES authentication_providers(id)
);
```
**Fields**:

- `id`: Unique identifier.
- `user_id`: References users.id.
- `provider_id`: References authentication_providers.id.
- `provider_user_id`: User's ID on the provider's platform.
- `access_token`: Access token for API calls.
- `refresh_token`: Token to refresh the access token.
- `token_expiry`: When the access token expires.
- `additional_data`: JSON field to store any provider-specific data.
- `created_at`: Timestamp when the record was created.
- `updated_at`: Timestamp when the record was last updated.


## Currencies Table (`currencies`)

Stores information about supported currencies.

```sql
CREATE TABLE currencies (
  code VARCHAR(10) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  symbol VARCHAR(10),
  decimals INT DEFAULT 8
);
```
**Fields**:

- `code`: Currency code (e.g., 'QRL', 'ZOND').
- `name`: Full name of the currency.
- `symbol`: Symbol used for the currency.
- `decimals`: Number of decimal places supported.


## Wallets Table (`wallets`)

Stores wallet information for users, supporting multiple currencies.

```sql
CREATE TABLE wallets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  currency_code VARCHAR(10) NOT NULL,
  public_address VARCHAR(80) NOT NULL,
  balance DECIMAL(24,9) NOT NULL DEFAULT 0.000000000,
  qr_code BLOB,
  is_retired BOOLEAN DEFAULT FALSE,
  retired_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (currency_code) REFERENCES currencies(code),
  UNIQUE KEY (user_id, currency_code)
);
```

**Fields**:

- `id`: Unique identifier for the wallet.
- `user_id`: References users.id.
- `currency_code`: References currencies.code.
- `public_address`: Wallet's public address.
- `balance`: Last known balance of the wallet.
- `qr_code`: QR code image for deposits.
- `is_retired`: Indicates if the wallet is retired.
- `retired_at`: Timestamp when the wallet was retired.
- `created_at`: Timestamp when the wallet was created.
- `updated_at`: Timestamp when the wallet was last updated.


## Tips Table (`tips`)

Records each tip initiated by a user.

```sql
CREATE TABLE tips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id INT NOT NULL,
  sender_user_id INT NOT NULL,
  message VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields**:

- `id`: Unique identifier for the tip.
- `transaction_id`: References transactions.id.
- `sender_user_id`: References users.id of the sender.
- `message`: Optional message from the sender.
- `created_at`: Timestamp when the tip was created.


## Tip Recipients Table (`tip_recipients`)

Associates multiple recipients with a tip.

```sql
CREATE TABLE tip_recipients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tip_id INT NOT NULL,
  recipient_user_id INT,
  recipient_username VARCHAR(50),
  amount DECIMAL(24,9) NOT NULL CHECK (amount > 0),
  FOREIGN KEY (tip_id) REFERENCES tips(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_user_id) REFERENCES users(id)
);
```

**Fields**:

- `id`: Unique identifier for the record.
- `tip_id`: References tips.id.
- `recipient_user_id`: References users.id of the recipient (nullable for unregistered users).
- `recipient_username`: Username of the recipient (used if recipient_user_id is NULL).
- `amount`: Amount allocated to the recipient.

**Notes**:

- For unregistered recipients, recipient_username is used.
- Upon recipient registration, update recipient_user_id.


## Transaction Types Table (transaction_types)

Stores different types of transactions.

```sql
CREATE TABLE transaction_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255)
);
```

**Fields**:

- `id`: Unique identifier for the transaction type.
- `name`: Name of the transaction type (e.g., 'tip', 'withdrawal', 'deposit', 'promotion_payout').
- `description`: Optional description for clarity.

**Initial Data**:

```sql
INSERT INTO transaction_types (name, description) VALUES
  ('tip', 'User-to-user tip'),
  ('withdrawal', 'Withdrawal to external address'),
  ('deposit', 'User deposit'),
  ('promotion_payout', 'Payout from a promotion');
```

## Transactions Table (`transactions`)

Records all blockchain transactions related to tips, withdrawals, and other activities.

```sql
CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  transaction_type_id INT NOT NULL,
  currency_code VARCHAR(10) NOT NULL,
  amount DECIMAL(24,9) NOT NULL CHECK (amount >= 0),
  tx_hash VARCHAR(255) UNIQUE NOT NULL,
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (transaction_type_id) REFERENCES transaction_types(id),
  FOREIGN KEY (currency_code) REFERENCES currencies(code)
);
```

**Fields**:

- `id`: Unique transaction identifier.
- `user_id`: References users.id.
- `transaction_type_id`: References transaction_types.id.
- `currency_code`: References currencies.code.
- `amount`: Transaction amount.
- `tx_hash`: Unique transaction hash.
- `status`: Transaction status.
- `created_at`: Timestamp when the transaction was created.
- `updated_at`: Timestamp when the transaction was last updated.


## Withdrawals Table (`withdrawals`)

Logs user-initiated withdrawals to external addresses.

```sql
CREATE TABLE withdrawals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id INT NOT NULL,
  to_address VARCHAR(80) NOT NULL,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
);
```
**Fields**:

- `id`: Unique identifier for the withdrawal.
- `transaction_id`: References transactions.id.
- `to_address`: External address where funds are sent.


## Promotions Table (`promotions`)

Manages promotional events and campaigns.

```sql
CREATE TABLE promotions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  start_date DATETIME,
  end_date DATETIME
);
```

**Fields**:

- `id`: Unique identifier for the promotion.
- `name`: Name of the promotion.
- `description`: Description of the promotion.
- `start_date`: Start date and time.
- `end_date`: End date and time.

## User Promotions Table (`user_promotions`)

Tracks user participation in promotions.

```sql
CREATE TABLE user_promotions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  promotion_id INT NOT NULL,
  is_redeemed BOOLEAN DEFAULT FALSE,
  redemption_date DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (promotion_id) REFERENCES promotions(id)
);
```

**Fields**:

- `id`: Unique identifier for the record.
- `user_id`: References users.id.
- `promotion_id`: References promotions.id.
- `is_redeemed`: Indicates if the promotion has been redeemed.
- `redemption_date`: Timestamp of redemption.

## Users Agree Table (users_agree)

Records user agreement to terms and conditions.

```sql
CREATE TABLE users_agree (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  has_agreed BOOLEAN NOT NULL,
  agreed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

Fields:

- `id`: Unique identifier.
- `user_id`: References users.id.
- `has_agreed`: Indicates agreement status.
- `agreed_at`: Timestamp when the user agreed.

### Future Tips Table (future_tips)

Stores tips intended for users who have not yet registered.

```sql
CREATE TABLE future_tips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tip_id INT NOT NULL,
  recipient_username VARCHAR(50) NOT NULL,
  amount DECIMAL(24,9) NOT NULL CHECK (amount > 0),
  currency_code VARCHAR(10) NOT NULL,
  is_paid_out BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tip_id) REFERENCES tips(id) ON DELETE CASCADE,
  FOREIGN KEY (currency_code) REFERENCES currencies(code)
);
```

**Fields**:

- `id`: Unique identifier.
- `tip_id`: References tips.id.
- `recipient_username`: Username of the intended recipient.
- `amount`: Amount to be tipped.
- `currency_code`: Currency used.
- `is_paid_out`: Indicates if the tip has been paid out.
- `created_at`: Timestamp when the tip was created.

## Notes and Constraints

**Foreign Keys**: All foreign keys are defined with ON DELETE CASCADE to ensure referential integrity and automatically remove related records when a user or related entity is deleted.
**Unique Constraints**: Unique constraints are applied where necessary to prevent duplicate entries (e.g., unique usernames, one wallet per user per currency).
**Data Types**: Appropriate data types are used for fields, such as DECIMAL(24,9) for amounts to handle cryptocurrencies with high precision.
**Timestamp Fields**: Standardized timestamp fields (created_at, updated_at, etc.) are used across tables for consistency.
**Indexes**: Implicitly created by primary keys and unique constraints. Additional indexes can be added on frequently queried fields for performance optimization.

> **Note**: The discord_link and faucet_payouts tables have been omitted because the account linking is now handled through the authentication_providers and user_authentications tables, and faucet payouts are recorded in the transactions table with the appropriate transaction_type_id.

## Web3 Wallets Table (`web3_wallets`)

This table stores Web3 addresses linked to users, similar to the wallets table but specifically for Web3 addresses (e.g., Ethereum, Binance Smart Chain).

```sql
CREATE TABLE web3_wallets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  blockchain VARCHAR(50) NOT NULL, -- Blockchain name (e.g., 'ethereum', 'polygon')
  public_address VARCHAR(42) NOT NULL, -- Web3 public address (e.g., 0x...)
  is_primary BOOLEAN DEFAULT FALSE, -- Indicates if this is the user's primary Web3 address
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY (public_address, blockchain) -- Ensure unique Web3 address for a given blockchain
);

```

**Fields**:

- `id`: Unique identifier for the Web3 wallet.
- `user_id`: References users.id.
- `blockchain`: Name of the blockchain (e.g., 'ethereum', 'polygon', 'binance').
- `public_address`: User's Web3 public address.
- `is_primary`: Boolean flag to indicate if this is the user's primary Web3 address.
- `created_at`: Timestamp when the address was linked.
- `updated_at`: Timestamp when the record was last updated.




## Web3 Verifications Table (`web3_verifications`)

This table stores details of Web3 verifications for users, using cryptographic signatures to validate that they control the Web3 address.

```sql
CREATE TABLE web3_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  web3_wallet_id INT NOT NULL, -- Links to the web3_wallets table
  signature VARCHAR(255) NOT NULL, -- The cryptographic signature provided by the user
  message VARCHAR(255) NOT NULL, -- Message used for signing (e.g., nonce or challenge)
  verified BOOLEAN DEFAULT FALSE, -- Whether the signature has been verified
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (web3_wallet_id) REFERENCES web3_wallets(id) ON DELETE CASCADE
);

```

**Fields**:

- `id`: Unique identifier for the verification attempt.
- `user_id`: References users.id.
- `web3_wallet_id`: References web3_wallets.id to indicate which wallet is being verified.
- `signature`: Cryptographic signature provided by the user during verification.
- `message`: The message that was signed (often a nonce or a challenge).
- `verified`: Boolean to indicate if the signature has been successfully verified.
- `created_at`: Timestamp when the verification attempt occurred.
- `updated_at`: Timestamp when the record was last updated.

## Nonce Table (`nonces`)

This table tracks nonces that are generated to prevent replay attacks during the Web3 signature verification process. A nonce is a one-time-use random string that the user signs with their private key.

```sql
CREATE TABLE nonces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  web3_wallet_id INT NOT NULL, -- Links to the web3_wallets table
  nonce VARCHAR(255) NOT NULL, -- Unique nonce sent to the user to sign
  is_used BOOLEAN DEFAULT FALSE, -- Whether this nonce has already been used for verification
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (web3_wallet_id) REFERENCES web3_wallets(id) ON DELETE CASCADE
);

```

**Fields**:

- `id`: Unique identifier for the nonce.
- `user_id`: References users.id.
- `web3_wallet_id`: References web3_wallets.id.
- `nonce`: The random nonce that the user signs for verification.
- `is_used`: Boolean flag indicating if the nonce has already been used.
- `created_at`: Timestamp when the nonce was created.
- `updated_at`: Timestamp when the record was last updated.