# Database Schema Documentation

## Table of Contents

- [Overview](#overview)
- [User Management](#user-management)
  - [Users (`users`)](#users-users)
  - [User Emails (`user_emails`)](#user-emails-user_emails)
  - [User Settings (`user_settings`)](#user-settings-user_settings)
  - [User Agreements (`users_agree`)](#user-agreements-users_agree)
- [Authentication and Security](#authentication-and-security)
  - [Authentication Types (`auth_types`)](#authentication-types-auth_types)
  - [Services (`services`)](#services-services)
  - [Authentication Providers (`authentication_providers`)](#authentication-providers-authentication_providers)
  - [User Authentications (`user_authentications`)](#user-authentications-user_authentications)
  - [Passwordless Tokens (`passwordless_tokens`)](#passwordless-tokens-passwordless_tokens)
  - [JWT Refresh Tokens (`jwt_refresh_tokens`)](#jwt-refresh-tokens-jwt_refresh_tokens)
  - [User Two-Factor Authentication (`user_2fa`)](#user-two-factor-authentication-user_2fa)
  - [API Keys (`api_keys`)](#api-keys-api_keys)
  - [API Rate Limits (`api_rate_limits`)](#api-rate-limits-api_rate_limits)
  - [API Key Rotations (`api_key_rotations`)](#api-key-rotations-api_key_rotations)
  - [Security Logs (`security_logs`)](#security-logs-security_logs)
- [Blockchain and Wallets](#blockchain-and-wallets)
  - [Currencies (`currencies`)](#currencies-currencies)
  - [Wallets (`wallets`)](#wallets-wallets)
  - [Web3 Wallets (`web3_wallets`)](#web3-wallets-web3_wallets)
  - [Web3 Verifications (`web3_verifications`)](#web3-verifications-web3_verifications)
  - [Nonces (`nonces`)](#nonces-nonces)
- [Transactions and Tips](#transactions-and-tips)
  - [Transaction Types (`transaction_types`)](#transaction-types-transaction_types)
  - [Transactions (`transactions`)](#transactions-transactions)
  - [Tips (`tips`)](#tips-tips)
  - [Tip Recipients (`tip_recipients`)](#tip-recipients-tip_recipients)
  - [Withdrawals (`withdrawals`)](#withdrawals-withdrawals)
  - [Future Tips (`future_tips`)](#future-tips-future_tips)
- [Promotions and Rewards](#promotions-and-rewards)
  - [Promotions (`promotions`)](#promotions-promotions)
  - [User Promotions (`user_promotions`)](#user-promotions-user_promotions)
- [Guild and Role Management](#guild-and-role-management)
  - [Guilds (`guilds`)](#guilds-guilds)
  - [Guild Features (`guild_features`)](#guild-features-guild_features)
  - [Roles (`roles`)](#roles-roles)
  - [Permissions (`permissions`)](#permissions-permissions)
  - [Role Permissions (`role_permissions`)](#role-permissions-role_permissions)
  - [User Roles (`user_roles`)](#user-roles-user_roles)
  - [Guild Roles (`guild_roles`)](#guild-roles-guild_roles)
  - [Guild Permissions (`guild_permissions`)](#guild-permissions-guild_permissions)
  - [Guild Mod Users (`guild_mod_users`)](#guild-mod-users-guild_mod_users)
  - [Guild Admin Users (`guild_admin_users`)](#guild-admin-users-guild_admin_users)
  - [Allowed Channels (`allowed_channels`)](#allowed-channels-allowed_channels)
  - [Faucet Channels (`faucet_channels`)](#faucet-channels-faucet_channels)
- [Analytics and Logging](#analytics-and-logging)
  - [User Analytics (`user_analytics`)](#user-analytics-user_analytics)
  - [Balance Snapshots (`balance_snapshots`)](#balance-snapshots-balance_snapshots)
  - [Data Access Logs (`data_access_logs`)](#data-access-logs-data_access_logs)
- [Notifications](#notifications)
  - [Notification Types (`notification_types`)](#notification-types-notification_types)
  - [Notifications (`notifications`)](#notifications-notifications)
  - [User Notifications (`user_notifications`)](#user-notifications-user_notifications)
  - [User Notification Preferences (`user_notification_preferences`)](#user-notification-preferences-user_notification_preferences)
  - [Guild Notifications (`guild_notifications`)](#guild-notifications-guild_notifications)
  - [User Guild Notifications (`user_guild_notifications`)](#user-guild-notifications-user_guild_notifications)
  - [Guild Notification Queue (`guild_notification_queue`)](#guild-notification-queue-guild_notification_queue)
- [Notes and Constraints](#notes-and-constraints)

---

## Overview

This document provides a comprehensive overview of the database schema, detailing each table, its purpose, and its fields. The schema is designed to support a multi-platform application with features including authentication, blockchain interactions, promotions, notifications, and more.

---

## User Management

### Users (`users`)

Stores unique user information, including a unique username used across the app for identification.

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**

- `id`: Unique identifier for each user.
- `username`: Unique username used as a universal identifier.
- `password_hash`: Hashed password (if supporting direct authentication).
- `created_at`: Timestamp when the user was created.
- `updated_at`: Timestamp when the user was last updated.

### User Emails (`user_emails`)

Stores user email addresses, primary/valid flags, and subscription status

```sql
CREATE TABLE user_emails (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  is_valid BOOLEAN DEFAULT TRUE,
  is_subscribed BOOLEAN DEFAULT FALSE, -- Opt-in for mailing lists
  validation_token VARCHAR(255), -- Token for email validation process
  validated_at DATETIME, -- Timestamp when the email was validated
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY (user_id, email), -- Ensures each user cannot have duplicate email addresses
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `user_id`: References `users.id`.
- `email`: User's email address.
- `is_primary`: Indicates if this is the primary email.
- `is_valid`: Indicates if the email is valid.
- `is_subscribed`: User's subscription status to mailing lists.
- `validation_token`: Token for email validation.
- `validated_at`: Timestamp when the email was validated.
- `created_at`: Timestamp when the record was created.
- `updated_at`: Timestamp when the record was last updated.

### User Settings (`user_settings`)

Flexible key-value structure for user preferences and settings.

```sql
CREATE TABLE user_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  setting_key VARCHAR(50) NOT NULL, -- Name of the setting (e.g., 'theme', 'email_notifications')
  setting_value VARCHAR(255), -- Value of the setting (e.g., 'dark', 'true', 'QRL')
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier for each setting entry.
- `user_id`: References the id from the users table, associating the setting with a specific user.
- `setting_key`: The name of the preference or setting being stored (e.g., "theme" for user interface preferences or "notification" for notification settings).
- `setting_value`: The value of the setting (e.g., "dark" for theme or "true" for enabling notifications).

### User Agreements (`users_agree`)

Tracks user agreement to terms and conditions.

```sql
CREATE TABLE users_agree (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  has_agreed BOOLEAN NOT NULL,
  agreed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `user_id`: References `users.id`.
- `has_agreed`: Indicates agreement status.
- `agreed_at`: Timestamp when the user agreed.

---

## Authentication and Security

### Authentication Types (`auth_types`)

Defines different authentication types supported.

```sql
CREATE TABLE auth_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);
```

**Fields:**

- `id`: Unique identifier for the authentication type.
- `name`: Name of the authentication type (e.g., 'oauth2', 'api_key').

### Services (`services`)

Defines the various platforms or services that users can connect to.

```sql
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);
```

**Fields:**

- `id`: Unique identifier for the service.
- `name`: Name of the service (e.g., 'discord', 'twitter').

### Authentication Providers (`authentication_providers`)

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

**Fields:**

- `id`: Unique identifier.
- `service_id`: References `services.id`.
- `auth_type_id`: References `auth_types.id`.
- `client_id`: Client ID for OAuth providers.
- `client_secret`: Client secret for OAuth providers.
- `auth_url`: Authorization URL.
- `token_url`: Token exchange URL.
- `scopes`: Permissions requested.
- `created_at`: Timestamp when the record was created.
- `updated_at`: Timestamp when the record was last updated.

### User Authentications (`user_authentications`)

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

**Fields:**

- `id`: Unique identifier.
- `user_id`: References `users.id`.
- `provider_id`: References `authentication_providers.id`.
- `provider_user_id`: User's ID on the provider's platform.
- `access_token`: Access token for API calls.
- `refresh_token`: Token to refresh the access token.
- `token_expiry`: When the access token expires.
- `additional_data`: JSON field for provider-specific data.
- `created_at`: Timestamp when the record was created.
- `updated_at`: Timestamp when the record was last updated.

### Passwordless Tokens (`passwordless_tokens`)

Stores tokens for passwordless authentication methods.

```sql
CREATE TABLE passwordless_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL, -- Token sent to user for passwordless login
  is_used BOOLEAN DEFAULT FALSE, -- Track if the token has been used
  expires_at DATETIME NOT NULL, -- Token expiration time
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE (token),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `user_id`: References `users.id`.
- `token`: Token for passwordless login.
- `is_used`: Indicates if the token has been used.
- `expires_at`: Token expiration time.
- `created_at`: Timestamp when the token was created.
- `updated_at`: Timestamp when the record was last updated.

### JWT Refresh Tokens (`jwt_refresh_tokens`)

Stores JWT refresh tokens with expiration and revocation details.

```sql
CREATE TABLE jwt_refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  refresh_token VARCHAR(255) NOT NULL,
  issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL, -- Token expiration time
  revoked_at DATETIME, -- Time the token was revoked (if applicable)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE (refresh_token),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `user_id`: References `users.id`.
- `refresh_token`: The JWT refresh token.
- `issued_at`: Timestamp when the token was issued.
- `expires_at`: Token expiration time.
- `revoked_at`: Timestamp if the token was revoked.
- `created_at`: Timestamp when the record was created.
- `updated_at`: Timestamp when the record was last updated.

### User Two-Factor Authentication (`user_2fa`)

Stores users' two-factor authentication settings.

```sql
CREATE TABLE user_2fa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  is_2fa_enabled BOOLEAN DEFAULT FALSE,
  secret_key VARCHAR(255), -- Key for generating TOTP codes
  backup_codes TEXT, -- Stores hashed backup codes
  otp_verified BOOLEAN DEFAULT FALSE, -- If the OTP has been verified
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `user_id`: References `users.id`.
- `is_2fa_enabled`: Indicates if 2FA is enabled.
- `secret_key`: Secret key for TOTP generation.
- `backup_codes`: Hashed backup codes.
- `otp_verified`: Indicates if the OTP has been verified.
- `created_at`: Timestamp when the record was created.
- `updated_at`: Timestamp when the record was last updated.

### API Keys (`api_keys`)

Stores API keys for user access.

```sql
CREATE TABLE api_keys (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  api_key VARCHAR(255) NOT NULL, -- The actual API key
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL, -- When the key expires
  is_revoked BOOLEAN DEFAULT FALSE, -- Manual revocation flag
  last_used_at DATETIME, -- Last time the key was used
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `user_id`: References `users.id`.
- `api_key`: The API key.
- `created_at`: Timestamp when the API key was created.
- `expires_at`: Expiration date of the API key.
- `is_revoked`: Indicates if the key has been revoked.
- `last_used_at`: Timestamp of the last use.

### API Rate Limits (`api_rate_limits`)

Tracks API usage for rate limiting.

```sql
CREATE TABLE api_rate_limits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  api_key_id INT NOT NULL,
  request_count INT DEFAULT 0, -- Number of requests made
  period_start DATETIME DEFAULT CURRENT_TIMESTAMP, -- Start of the rate-limit period
  period_end DATETIME NOT NULL, -- End of the rate-limit period
  FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `api_key_id`: References `api_keys.id`.
- `request_count`: Number of requests made.
- `period_start`: Start time of the rate limit period.
- `period_end`: End time of the rate limit period.

### API Key Rotations (`api_key_rotations`)

Tracks API key rotations for security purposes.

```sql
CREATE TABLE api_key_rotations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  old_api_key VARCHAR(255), -- Previous API key
  new_api_key VARCHAR(255), -- Newly generated API key
  rotated_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- When rotation occurred
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `old_api_key`: The old API key.
- `new_api_key`: The new API key.
- `rotated_at`: Timestamp when rotation occurred.
- `user_id`: References `users.id`.

### Security Logs (`security_logs`)

Tracks security-related events.

```sql
CREATE TABLE security_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT, -- Could be NULL for system-wide events
  event_type VARCHAR(50) NOT NULL, -- E.g., 'login_failed'
  event_details TEXT, -- Detailed description of the event
  event_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, -- When the event occurred
  severity_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'low', -- Security level
  user_ip VARCHAR(45), -- IP address involved
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `user_id`: References `users.id`.
- `event_type`: Type of event.
- `event_details`: Detailed event description.
- `event_timestamp`: When the event occurred.
- `severity_level`: Security severity level.
- `user_ip`: IP address involved.

---

## Blockchain and Wallets

### Currencies (`currencies`)

Stores information about supported currencies.

```sql
CREATE TABLE currencies (
  code VARCHAR(10) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  symbol VARCHAR(10),
  decimals INT DEFAULT 8
);
```

**Fields:**

- `code`: Currency code (e.g., 'QRL').
- `name`: Full name of the currency.
- `symbol`: Symbol used for the currency.
- `decimals`: Number of decimal places.

### Wallets (`wallets`)

Stores wallet information for users and supported currencies.

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
  UNIQUE KEY (user_id, currency_code),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (currency_code) REFERENCES currencies(code)
);
```

**Fields:**

- `id`: Unique identifier.
- `user_id`: References `users.id`.
- `currency_code`: References `currencies.code`.
- `public_address`: Wallet's public address.
- `balance`: Last known balance.
- `qr_code`: QR code image for deposits.
- `is_retired`: Indicates if the wallet is retired.
- `retired_at`: Timestamp when retired.
- `created_at`: Timestamp when created.
- `updated_at`: Timestamp when updated.

### Web3 Wallets (`web3_wallets`)

Stores Web3 wallet addresses linked to users.

```sql
CREATE TABLE web3_wallets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  blockchain VARCHAR(50) NOT NULL, -- Blockchain name (e.g., 'ethereum')
  public_address VARCHAR(42) NOT NULL, -- Web3 public address
  is_primary BOOLEAN DEFAULT FALSE, -- Is this the primary address?
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY (public_address, blockchain), -- Ensure unique address per blockchain
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `user_id`: References `users.id`.
- `blockchain`: Name of the blockchain.
- `public_address`: User's Web3 public address.
- `is_primary`: Indicates if primary address.
- `created_at`: Timestamp when linked.
- `updated_at`: Timestamp when updated.

### Web3 Verifications (`web3_verifications`)

Stores details of Web3 verifications using cryptographic signatures.

```sql
CREATE TABLE web3_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  web3_wallet_id INT NOT NULL, -- Links to web3_wallets
  signature VARCHAR(255) NOT NULL, -- Cryptographic signature
  message VARCHAR(255) NOT NULL, -- Message used for signing
  verified BOOLEAN DEFAULT FALSE, -- Whether verified
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (web3_wallet_id) REFERENCES web3_wallets(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `user_id`: References `users.id`.
- `web3_wallet_id`: References `web3_wallets.id`.
- `signature`: Cryptographic signature.
- `message`: Message that was signed.
- `verified`: Indicates if verification succeeded.
- `created_at`: Timestamp when verification attempted.
- `updated_at`: Timestamp when updated.

### Nonces (`nonces`)

Tracks nonces used for Web3 signature verifications.

```sql
CREATE TABLE nonces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  web3_wallet_id INT NOT NULL, -- Links to web3_wallets
  nonce VARCHAR(255) NOT NULL, -- Unique nonce
  is_used BOOLEAN DEFAULT FALSE, -- Whether used
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (web3_wallet_id) REFERENCES web3_wallets(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `user_id`: References `users.id`.
- `web3_wallet_id`: References `web3_wallets.id`.
- `nonce`: The nonce for signing.
- `is_used`: Indicates if nonce is used.
- `created_at`: Timestamp when created.
- `updated_at`: Timestamp when updated.

---

## Transactions and Tips

### Transaction Types (`transaction_types`)

Defines different types of transactions.

```sql
CREATE TABLE transaction_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255)
);
```

**Fields:**

- `id`: Unique identifier.
- `name`: Name of the transaction type (e.g., 'tip').
- `description`: Description.

**Initial Data:**

```sql
INSERT INTO transaction_types (name, description) VALUES
  ('tip', 'User-to-user tip'),
  ('withdrawal', 'Withdrawal to external address'),
  ('deposit', 'User deposit'),
  ('promotion_payout', 'Payout from a promotion');
```

### Transactions (`transactions`)

Records all blockchain transactions.

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

**Fields:**

- `id`: Unique transaction identifier.
- `user_id`: References `users.id`.
- `transaction_type_id`: References `transaction_types.id`.
- `currency_code`: References `currencies.code`.
- `amount`: Transaction amount.
- `tx_hash`: Unique transaction hash.
- `status`: Transaction status.
- `created_at`: Timestamp when created.
- `updated_at`: Timestamp when updated.

### Tips (`tips`)

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

**Fields:**

- `id`: Unique identifier.
- `transaction_id`: References `transactions.id`.
- `sender_user_id`: References `users.id`.
- `message`: Optional message.
- `created_at`: Timestamp when tip was created.

### Tip Recipients (`tip_recipients`)

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

**Fields:**

- `id`: Unique identifier.
- `tip_id`: References `tips.id`.
- `recipient_user_id`: References `users.id` (nullable).
- `recipient_username`: Username if recipient not registered.
- `amount`: Amount allocated to recipient.

### Withdrawals (`withdrawals`)

Logs user-initiated withdrawals to external addresses.

```sql
CREATE TABLE withdrawals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id INT NOT NULL,
  to_address VARCHAR(80) NOT NULL,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `transaction_id`: References `transactions.id`.
- `to_address`: External address.

### Future Tips (`future_tips`)

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

**Fields:**

- `id`: Unique identifier.
- `tip_id`: References `tips.id`.
- `recipient_username`: Username of intended recipient.
- `amount`: Tip amount.
- `currency_code`: Currency used.
- `is_paid_out`: Indicates if tip is paid out.
- `created_at`: Timestamp when created.

---

## Promotions and Rewards

### Promotions (`promotions`)

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

**Fields:**

- `id`: Unique identifier.
- `name`: Name of the promotion.
- `description`: Description.
- `start_date`: Start date.
- `end_date`: End date.

### User Promotions (`user_promotions`)

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

**Fields:**

- `id`: Unique identifier.
- `user_id`: References `users.id`.
- `promotion_id`: References `promotions.id`.
- `is_redeemed`: Indicates if redeemed.
- `redemption_date`: When redeemed.

---
### Guild Promotions (`guild_promotions`)

Guild Promotions Table: This table will store the core promotion details for each guild.

```sql
CREATE TABLE guild_promotions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guild_id BIGINT NOT NULL, -- References guilds
  name VARCHAR(100) NOT NULL, -- Promotion name
  description TEXT, -- Details of the promotion
  start_date DATETIME, -- Start time of the promotion
  end_date DATETIME, -- End time of the promotion
  reward_type ENUM('tokens', 'tips', 'access') NOT NULL, -- Type of reward
  reward_amount DECIMAL(24,9) DEFAULT NULL, -- Optional: Amount of tokens or tips as reward
  is_active BOOLEAN DEFAULT TRUE, -- Whether the promotion is currently active
  created_by BIGINT NOT NULL, -- ID of admin/mod who created the promotion
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the promotion was created
  FOREIGN KEY (guild_id) REFERENCES guilds(guild_id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES guild_admin_users(user_id)
);
```
**Fields:**

- `id`: Unique identifier for each promotion.
- `guild_id`: The guild where the promotion is hosted.
- `name`: The name of the promotion.
- `description`: Full description and terms.
- `start_date`: When the promotion begins.
- `end_date`: When the promotion ends.
- `reward_type`: The type of reward (tokens, tips, special access, etc.).
- `reward_amount`: Amount of reward (if applicable, for tips or tokens).
- `is_active`: Indicates if the promotion is currently running.
- `created_by`: The admin or moderator who created the promotion.
- `created_at`: Timestamp when the promotion was created.


## Guild Promotion Participation Table

Track each user's interaction with a guild-specific promotion (e.g., whether they have signed up, redeemed, or referred others).

```sql
CREATE TABLE guild_promotion_participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  promotion_id INT NOT NULL, -- References guild_promotions
  user_id INT NOT NULL, -- References users
  referral_code VARCHAR(50), -- Optional: Referral code used
  is_redeemed BOOLEAN DEFAULT FALSE, -- Whether the user has redeemed the reward
  redemption_date DATETIME, -- When the reward was redeemed
  points_earned INT DEFAULT 0, -- Optional: Points or scores earned
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Timestamp of user participation
  FOREIGN KEY (promotion_id) REFERENCES guild_promotions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```


- `id`: Unique identifier for each participant.
- `promotion_id`: The promotion in which the user is participating.
- `user_id`: The user participating in the promotion.
- `referral_code`: Optional referral code used for joining.
- `is_redeemed`: Whether the user has claimed the reward.
- `redemption_date`: Timestamp of reward redemption.
- `points_earned`: Any points or metrics tracked during the promotion.
- `created_at`: When the user signed up for the promotion.


### Guild Promotions Rewards Table (`guild_promotion_rewards`)

 If promotions offer different types of rewards based on criteria (e.g., milestones, achievements), this table can store those reward tiers.

```sql
CREATE TABLE guild_promotion_rewards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  promotion_id INT NOT NULL, -- References guild_promotions
  reward_type ENUM('tokens', 'tips', 'access') NOT NULL, -- Type of reward
  reward_amount DECIMAL(24,9) DEFAULT NULL, -- Amount of reward (if applicable)
  milestone VARCHAR(50), -- Optional milestone for earning the reward (e.g., '10 referrals')
  FOREIGN KEY (promotion_id) REFERENCES guild_promotions(id) ON DELETE CASCADE
);

```

**Fields**:

- `id`: Unique identifier for each reward.
- `promotion_id`: The promotion this reward is linked to.
- `reward_type`: The type of reward.
- `reward_amount`: The value or amount of the reward.
- `milestone`: Optional milestone criteria for earning the reward.


## Guild and Role Management

### Guilds (`guilds`)

Stores core guild (e.g., Discord server) information.

```sql
CREATE TABLE guilds (
  guild_id BIGINT PRIMARY KEY,
  is_allowed BOOLEAN DEFAULT FALSE,
  announcement_channel BIGINT,
  mod_channel BIGINT,
  command_prefix VARCHAR(5) DEFAULT '!',
  allow_all_channels BOOLEAN DEFAULT FALSE, -- Indicates if all channels are allowed
  bot_join_date DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**

- `guild_id`: Unique identifier.
- `is_allowed`: Indicates if the bot is allowed in the guild.
- `announcement_channel`: Channel ID for announcements.
- `mod_channel`: Channel ID for moderators.
- `command_prefix`: Command prefix.
- `allow_all_channels`: If all channels are allowed.
- `bot_join_date`: When the bot joined.

### Guild Features (`guild_features`)

Stores feature toggles for each guild.

```sql
CREATE TABLE guild_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guild_id BIGINT NOT NULL,
  feature_name VARCHAR(50),
  is_enabled BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (guild_id) REFERENCES guilds(guild_id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `guild_id`: References `guilds.guild_id`.
- `feature_name`: Name of the feature.
- `is_enabled`: Indicates if enabled.

### Roles (`roles`)

Defines global roles.

```sql
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255)
);
```

**Fields:**

- `id`: Unique identifier.
- `role_name`: Name of the role.
- `description`: Description.

### Permissions (`permissions`)

Defines global permissions.

```sql
CREATE TABLE permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  permission_name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255)
);
```

**Fields:**

- `id`: Unique identifier.
- `permission_name`: Name of the permission.
- `description`: Description.

### Role Permissions (`role_permissions`)

Associates roles with permissions.

```sql
CREATE TABLE role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);
```

**Fields:**

- `role_id`: References `roles.id`.
- `permission_id`: References `permissions.id`.

### User Roles (`user_roles`)

Associates users with roles for permission management.

```sql
CREATE TABLE user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
```

**Fields:**

- `user_id`: References `users.id`.
- `role_id`: References `roles.id`.

### Guild Roles (`guild_roles`)

Links guilds with global roles.

```sql
CREATE TABLE guild_roles (
  guild_id BIGINT NOT NULL,
  role_id INT NOT NULL,  -- Links to global 'roles' table
  mod_role BIGINT,
  admin_role BIGINT,
  PRIMARY KEY (guild_id, role_id),
  FOREIGN KEY (guild_id) REFERENCES guilds(guild_id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);
```

**Fields:**

- `guild_id`: References `guilds.guild_id`.
- `role_id`: References `roles.id`.
- `mod_role`: Guild-specific moderator role ID.
- `admin_role`: Guild-specific admin role ID.

### Guild Permissions (`guild_permissions`)

Guild-specific permissions for roles.

```sql
CREATE TABLE guild_permissions (
  guild_id BIGINT NOT NULL,
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (guild_id, role_id, permission_id),
  FOREIGN KEY (guild_id) REFERENCES guilds(guild_id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);
```

**Fields:**

- `guild_id`: References `guilds.guild_id`.
- `role_id`: References `roles.id`.
- `permission_id`: References `permissions.id`.

### Guild Mod Users (`guild_mod_users`)

Associates guilds with moderator users.

```sql
CREATE TABLE guild_mod_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guild_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  FOREIGN KEY (guild_id) REFERENCES guilds(guild_id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `guild_id`: References `guilds.guild_id`.
- `user_id`: User ID of the moderator.

### Guild Admin Users (`guild_admin_users`)

Associates guilds with admin users.

```sql
CREATE TABLE guild_admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guild_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  FOREIGN KEY (guild_id) REFERENCES guilds(guild_id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `guild_id`: References `guilds.guild_id`.
- `user_id`: User ID of the admin.

### Allowed Channels (`allowed_channels`)

Stores allowed channels for bot interaction.

```sql
CREATE TABLE allowed_channels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guild_id BIGINT NOT NULL,
  channel_id BIGINT NOT NULL,
  FOREIGN KEY (guild_id) REFERENCES guilds(guild_id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `guild_id`: References `guilds.guild_id`.
- `channel_id`: Channel ID allowed.

### Faucet Channels (`faucet_channels`)

Stores faucet-specific channels.

```sql
CREATE TABLE faucet_channels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guild_id BIGINT NOT NULL,
  channel_id BIGINT NOT NULL,
  FOREIGN KEY (guild_id) REFERENCES guilds(guild_id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `guild_id`: References `guilds.guild_id`.
- `channel_id`: Faucet channel ID.

---

## Analytics and Logging

### User Analytics (`user_analytics`)

Tracks detailed user interactions for analytics.

```sql
CREATE TABLE user_analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  action VARCHAR(50) NOT NULL, -- Action performed
  transaction_size DECIMAL(24,9) DEFAULT NULL, -- Size if applicable
  faucet_request_count INT DEFAULT 0, -- Number of faucet requests
  tip_count INT DEFAULT 0, -- Number of tips given
  response_time_ms INT NOT NULL, -- Time taken to process action
  action_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, -- When action occurred
  user_ip VARCHAR(45), -- IP address
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `user_id`: References `users.id`.
- `action`: Action performed.
- `transaction_size`: Size if applicable.
- `faucet_request_count`: Number of faucet requests.
- `tip_count`: Number of tips given.
- `response_time_ms`: Processing time.
- `action_timestamp`: When occurred.
- `user_ip`: IP address.

### Balance Snapshots (`balance_snapshots`)

Captures user balances at different intervals.

```sql
CREATE TABLE balance_snapshots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  currency_code VARCHAR(10) NOT NULL, -- Currency code
  balance DECIMAL(24,9) NOT NULL, -- User balance
  snapshot_time DATETIME DEFAULT CURRENT_TIMESTAMP, -- When snapshot taken
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (currency_code) REFERENCES currencies(code)
);
```

**Fields:**

- `id`: Unique identifier.
- `user_id`: References `users.id`.
- `currency_code`: References `currencies.code`.
- `balance`: User balance.
- `snapshot_time`: When snapshot taken.

### Data Access Logs (`data_access_logs`)

Logs data export or deletion requests for GDPR compliance.

```sql
CREATE TABLE data_access_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  access_type ENUM('data_export', 'data_deletion') NOT NULL, -- Type of request
  request_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, -- When requested
  completed_timestamp DATETIME, -- When fulfilled
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `user_id`: References `users.id`.
- `access_type`: Type of GDPR request.
- `request_timestamp`: When requested.
- `completed_timestamp`: When fulfilled.

---

## Notifications

### Notification Types (`notification_types`)

Categorizes different notifications.

```sql
CREATE TABLE notification_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type_name VARCHAR(50) NOT NULL, -- Type of notification
  description VARCHAR(255)
);
```

**Fields:**

- `id`: Unique identifier.
- `type_name`: Notification type name.
- `description`: Description.

### Notifications (`notifications`)

Stores global or non-guild-specific notifications.

```sql
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type_id INT NOT NULL, -- References notification_types
  content TEXT NOT NULL, -- Notification content
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (type_id) REFERENCES notification_types(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `type_id`: References `notification_types.id`.
- `content`: Notification content.
- `created_at`: Timestamp when created.

### User Notifications (`user_notifications`)

Stores notifications specific to each user, allowing the application to track whether a notification has been delivered and read by the user. Useful for features like alerts, announcements, and reminders.

```sql
CREATE TABLE user_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL, -- References users.id to associate the notification with a specific user
  notification_id INT NOT NULL, -- References notifications.id for the actual notification content
  is_read BOOLEAN DEFAULT FALSE, -- Tracks whether the user has opened/read the notification
  delivered_at DATETIME, -- Timestamp of when the notification was delivered to the user
  read_at DATETIME, -- Timestamp of when the notification was read (if applicable)
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier for the notification record.
- `user_id`: References the user who received the notification, ensuring notifications are user-specific.
- `notification_id`: References the notifications.id table, linking to the actual notification content (message, type).
- `is_read`: Indicates whether the user has opened/read the notification (false by default).
- `delivered_at`: The timestamp indicating when the notification was delivered to the user.
- `read_at`: The timestamp indicating when the user read the notification, if applicable.

### User Notification Preferences (`user_notification_preferences`)

Stores user preferences for receiving notifications.

```sql
CREATE TABLE user_notification_preferences (
  user_id INT NOT NULL, -- References users.id
  notify_by_email BOOLEAN DEFAULT TRUE,
  notify_by_sms BOOLEAN DEFAULT FALSE,
  notify_in_app BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**

- `user_id`: References `users.id`.
- `notify_by_email`: Email notifications.
- `notify_by_sms`: SMS notifications.
- `notify_in_app`: In-app notifications.

### Guild Notifications (`guild_notifications`)

Guild-specific notifications.

```sql
CREATE TABLE guild_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guild_id BIGINT NOT NULL, -- References guilds
  type_id INT NOT NULL, -- References notification_types
  content TEXT NOT NULL, -- Notification content
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by BIGINT NOT NULL, -- User ID of creator
  FOREIGN KEY (guild_id) REFERENCES guilds(guild_id) ON DELETE CASCADE,
  FOREIGN KEY (type_id) REFERENCES notification_types(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `guild_id`: References `guilds.guild_id`.
- `type_id`: References `notification_types.id`.
- `content`: Notification content.
- `created_at`: Timestamp when created.
- `created_by`: User ID of creator.

### User Guild Notifications (`user_guild_notifications`)

Maps guild notifications to users.

```sql
CREATE TABLE user_guild_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guild_notification_id INT NOT NULL, -- References guild_notifications
  user_id INT NOT NULL, -- References users.id
  is_read BOOLEAN DEFAULT FALSE,
  delivered_at DATETIME,
  read_at DATETIME,
  FOREIGN KEY (guild_notification_id) REFERENCES guild_notifications(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `guild_notification_id`: References `guild_notifications.id`.
- `user_id`: References `users.id`.
- `is_read`: Indicates if read.
- `delivered_at`: When delivered.
- `read_at`: When read.

### Guild Notification Queue (`guild_notification_queue`)

Queue for scheduling guild notifications.

```sql
CREATE TABLE guild_notification_queue (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guild_notification_id INT NOT NULL, -- References guild_notifications
  scheduled_for DATETIME NOT NULL, -- When to deliver
  status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
  attempts INT DEFAULT 0,
  FOREIGN KEY (guild_notification_id) REFERENCES guild_notifications(id) ON DELETE CASCADE
);
```

**Fields:**

- `id`: Unique identifier.
- `guild_notification_id`: References `guild_notifications.id`.
- `scheduled_for`: Scheduled delivery time.
- `status`: Delivery status.
- `attempts`: Number of attempts.

---

## Notes and Constraints

- **Foreign Keys**: All foreign keys are defined with `ON DELETE CASCADE` to ensure referential integrity and automatically remove related records when a user or related entity is deleted.
- **Unique Constraints**: Applied where necessary to prevent duplicate entries (e.g., unique usernames, one wallet per user per currency).
- **Data Types**: Appropriate data types are used for fields, such as `DECIMAL(24,9)` for amounts to handle cryptocurrencies with high precision.
- **Timestamp Fields**: Standardized timestamp fields (`created_at`, `updated_at`, etc.) are used across tables for consistency.
- **Indexes**: Implicitly created by primary keys and unique constraints. Additional indexes can be added on frequently queried fields for performance optimization.

> **Note**: The `discord_link` and `faucet_payouts` tables have been omitted because account linking is handled through the `authentication_providers` and `user_authentications` tables, and faucet payouts are recorded in the `transactions` table with the appropriate `transaction_type_id`.

---

