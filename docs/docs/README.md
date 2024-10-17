# Zond Bot Setup

The Zond bot requires access to a few dependencies and privileged access to both a QRL Node and a Zond node in order to send transactions.

This guide assumes that these are available on either a `localhost` or through a secure connection to these privileged ports.

## Requirements

- Node v20.17.0
- nvm (*recommended*)
- MySQL
- Zond Node API Access (*port:8454*)
- QRL Node with wallet-proxy (*port:5359*)


## Setup

Setting up the bot is complex and multifaceted. We have broken these into multiple documents to make this a little easier. 

Please follow each step here as they are all required.


### Discord Bot Setup

1. Clone the [zond-3 repository](https://github.com/fr1t2/zond-faucet) to the server that will run the bot
2. `cd zond-faucet` and ensure that you are using the required node version  using NVM `nvm use` 
	- If you do not have `nvm` installed, make sure your node version matches the version in the `.nvmrc` file.
3. Install the dependencies with `npm install`
4. Copy the config.json.example	 file to config.json and fill in the required fields. ([see the definitions below](#botconfig))
5. Install and sync a [local Zond node](https://test-zond.theqrl.org/linux.html)
6. Run the bot with `npm start`





### BotConfig

| Config Directive | Default Value | WhatsIt  |
|:---:|:---:|:---:|
| token | YOU NEED A TOKEN | Discord Token from the [Oauth2 page](https://discord.com/developers/applications/1213376569775620106/oauth2)|
| clientId | "1213376569775620106"  | [Client ID of the bot](https://discord.com/developers/applications/1213376569775620106/) |
| guildId | "401568138317135873"  | Guild ID from the server deployed into (*This may not matter, need to look into the usage*) |
| allowedChannels | "401568138317135875"], | List of channels that the bot is allowed to use, comma separated |
| allowedGuilds | "fr1t2_private"], | Named guilds that the bot is allowed to use  |
| faucetAddress | "0x20d20b8026b8f02540246f58120ddaaf35aecd9b"  | Address of the Faucet wallet. This needs to be [authorized and unlocked in the node to function](#node-wallet-unlock) Add 0x to the front of the address (*Look into CLEF*) |
| faucetAddressPassword | "password" |  |
| faucetTimeout | "600"  | Time between withdraws (in Milliseconds) |
| maxDrip | "1"  | max allowed drip for given time. (in quanta) |
| zondPubAPI | "192.168.1.40:8545"  | ond api {IP:PORT} 192.168.1.40:8454 |
| userName | "zond-3" |  |
| avatarImgLocation | "./discord/zond_3_Circumlunar.jpg" |  |
| activityString | "developers code"  | limited activity text string |
| activityType | "Watching"  | one of:{ Watching, Listening. Competing } |
| statusUpdate | "online"  | one of: { online, idle, dnd, invisible } |
| apiPort | 7575,  | the api port to run the bot services on |
| swaggerPort | 4000, | the api port to run the swagger services on |
| enableSwagger | true     | swagger port |




