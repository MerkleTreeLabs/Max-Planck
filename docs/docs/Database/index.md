
# Database Info

General layout of the tables in the DB.

| Table Name              | Columns                                                                                                                                         | Purpose                                                             |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------|
| `authentication_providers` | `id`, `service_id`, `auth_type_id`, `client_id`, `client_secret`, `auth_url`, `token_url`, `scopes`, `created_at`, `updated_at`                | Stores OAuth or authentication provider details                     |
| `auth_types`            | `id`, `name`                                                                                                                                    | Defines different authentication types (e.g., OAuth2, API Key)      |
| `currencies`            | `code`, `name`, `symbol`, `decimals`                                                                                                            | Stores supported currencies and their metadata                      |
| `future_tips`           | `id`, `tip_id`, `recipient_username`, `amount`, `currency_code`, `is_paid_out`, `created_at`                                                     | Stores tips intended for users who have not yet registered          |
| `jwt_refresh_tokens`     | `id`, `user_id`, `refresh_token`, `issued_at`, `expires_at`, `revoked_at`, `created_at`, `updated_at`                                           | Stores JWT refresh tokens, with expiration and revocation details   |
| `nonces`                | `id`, `user_id`, `web3_wallet_id`, `nonce`, `is_used`, `created_at`, `updated_at`                                                               | Tracks nonces for Web3 signature verifications to prevent replay     |
| `passwordless_tokens`    | `id`, `user_id`, `token`, `is_used`, `expires_at`, `created_at`, `updated_at`                                                                   | Stores tokens for passwordless login (e.g., magic links or OTP)     |
| `promotions`            | `id`, `name`, `description`, `start_date`, `end_date`                                                                                           | Manages promotional events and campaigns                            |
| `services`              | `id`, `name`                                                                                                                                    | Defines various services that users can connect to                  |
| `tip_recipients`        | `id`, `tip_id`, `recipient_user_id`, `recipient_username`, `amount`                                                                              | Associates recipients with tips, supporting multiple recipients     |
| `tips`                  | `id`, `transaction_id`, `sender_user_id`, `message`, `created_at`                                                                                | Records each tip initiated by a user                                |
| `transaction_types`      | `id`, `name`, `description`                                                                                                                    | Stores transaction types (e.g., tip, withdrawal, deposit)           |
| `transactions`          | `id`, `user_id`, `transaction_type_id`, `currency_code`, `amount`, `tx_hash`, `status`, `created_at`, `updated_at`                               | Records all blockchain transactions (e.g., tips, deposits)          |
| `user_2fa`              | `id`, `user_id`, `is_2fa_enabled`, `secret_key`, `backup_codes`, `otp_verified`, `created_at`, `updated_at`                                      | Stores users' 2FA settings, including TOTP secret and backup codes  |
| `user_authentications`   | `id`, `user_id`, `provider_id`, `provider_user_id`, `access_token`, `refresh_token`, `token_expiry`, `additional_data`, `created_at`, `updated_at` | Associates users with their authentication methods                  |
| `user_emails`           | `id`, `user_id`, `email`, `is_primary`, `is_valid`, `is_subscribed`, `validation_token`, `validated_at`, `created_at`, `updated_at`              | Stores user email addresses, primary/valid flags, and subscription  |
| `user_promotions`       | `id`, `user_id`, `promotion_id`, `is_redeemed`, `redemption_date`                                                                                | Tracks user participation in promotions                             |
| `users`                 | `id`, `username`, `password_hash`, `created_at`, `updated_at`                                                                                    | Stores unique user information and hashed passwords                 |
| `users_agree`           | `id`, `user_id`, `has_agreed`, `agreed_at`                                                                                                      | Tracks user agreement to terms and conditions                       |
| `wallets`               | `id`, `user_id`, `currency_code`, `public_address`, `balance`, `qr_code`, `is_retired`, `retired_at`, `created_at`, `updated_at`                | Stores wallet information for users and supported currencies        |
| `web3_verifications`    | `id`, `user_id`, `web3_wallet_id`, `signature`, `message`, `verified`, `created_at`, `updated_at`                                                | Stores cryptographic verification of Web3 wallets                   |
| `web3_wallets`          | `id`, `user_id`, `blockchain`, `public_address`, `is_primary`, `created_at`, `updated_at`                                                       | Stores Web3 wallet information (e.g., Ethereum addresses)           |
| `withdrawals`           | `id`, `transaction_id`, `to_address`                                                                                                            | Logs user-initiated withdrawals to external addresses               |


## Installation 

See the install doc for more info on the install process

[<kbd> <br> Database Install Docs <br> </kbd>][Instructions]
[Instructions]: ./Database_Instructions.md 'Link with example title.'

## Schema

[<kbd> <br> Database Schema <br> </kbd>][Schema]
[Schema]: ./Database_Schema.md 'Link with example title.'