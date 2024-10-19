# Zond Bot TODO



## Config

- [ ] Rework the config functions related to guilds/channels/roles and admin users

## General Bot Functions

### Add these functions to the bot:

- [ ] generate ephemeral random hash (ERH)
	- used to verify a user withdraw, secret key generation, or to confirm an admin function
	- generate and store for verification from user/admin
	- assign expiration time
	- **internal function not exposed directly to user!**

- Set Known Addresses
	- allow owners admin and mods to set the known addresses for exchanges etc so when a user looks it up there is a message of the known address. 

- [ ] Set allowed Guilds `/set guilds enable {GUILD_ID}` or `/set guilds disable {GUILD_ID}`
	- allow **bot owner** to set guild by name (or id Preferred)
	- add confirmation *ERH* to confirm with admin in DM
		- await response from admin in main chat and then delete hash, give thanks and process the command
	- Returns a link to add the bot to the given guild with sufficient privilege there. (Direct Message with discord developer link)

- [ ] Set Bot admin/privilege levels command `/set admin @USER` or `/set mod @USER` `/set none @USER` to remove
	- Only **bot owner** defined in config can set this and should be the only one to see the command available
	- add confirmation *ERH* to confirm with admin in DM
		- await response from admin in main chat and then delete hash, give thanks and process the command


- [ ] Set admin privilege(s) `/set privilege level={none, mod, admin } {ROLE_ID}`
	- set a privilege role that should be considered admin for the bot. (should be the same as the server owners/privileged users)
	- Only **bot owner** defined in config can set this and should be the only one to see the command available
	- Set another for moderator level actions matching the *mods*
	- another to set NONE and remove all privilege
	- add confirmation *ERH* to confirm with admin in DM
		- await response from admin in main chat and then delete hash, give thanks and process the command



- [ ] Set bot channels allowed `/set channel {CHANNEL_ID}`
	- **Admin** and **owner** can set the channels the bot is allowed. {DEFAULT to ALL}
	- Applies to the guild the command is sent in.
	- add confirmation *ERH* to confirm with admin in DM
		- await response from admin in main chat and then delete hash, give thanks and process the command




- [ ] assign role
	- sort the addition of roles that only the bot and *server admin* can edit.
	- create a clown/bad-bot role to assign any bot that interacts





- [ ] admin info
	- [ ] node info {QRL, ZOND}
	- [ ] Wallet details
	- [ ] User count
	- [ ] total's for various metrics
	- [ ] user details
		- [ ] balance
		- [ ] last drip
		- [ ] dry faucet attempts (timeout)
		- [ ] withdraw addresses and list of last 10
		- [ ] signup date
		- [ ] OG?

- [ ] Public Info
	- [ ] Bot info
		- [ ] blocknumber
		- [ ] uptime?
		- [ ] ping MS
		- [ ] Version

- [ ]Help
	- [ ] Give information on all commands
	- [ ] provide link to further documentation
	- [ ] give link to issues submission {package.json/bugs/url}

---

## Chain Functions


### QRL Chain Functions

Complete:
- [X] /qrl-balance
	- Get balance for a given address
	- Returns in either shor or quanta with flag
	- [ ] Add conversion to USD (Need price data)
	- [ ] Make default lookup tipbot address with no address given 

- [X] /qrl-block-by-number
	- get block by number, returns truncated data with link to explorer
	- converts some message data to text but needs improvement
	- [ ] Additional transaction data processing
- [X] /qrl-ots
	- Returns the next OTS key for a given address
- [X] /qrl-is-valid-address
	- Returns `TRUE/FALSE` if address is valid
- [X] /qrl-get-transaction
	- returns trunicatedc transaction details from a given `tx hash`
	- provides additional information with link to explorer
- [X] /qrl-add-addresses-with-slave
	- 

In Progress:

- [ ] GetRecoverySeeds
- [ ] GetWalletInfo
- [ ] GetTotalBalance
- [ ] RelayTransferTxnBySlave
- [ ] RelayMessageTxnBySlave
- [ ] RelayTokenTxnBySlave
- [ ] RelayTransferTokenTxnBySlave
- [ ] GetTransactionsByAddress
- [ ] GetNodeInfo