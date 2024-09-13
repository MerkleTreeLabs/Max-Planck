# Discord Bot

This works through the discord bot flow and server configuration. Commands can be added following this logic.

## `discord/index.js`

The discord bot runs from the js file located at `src/discord/index.js`. 

This file calls all JavaScript files located in the `/src/discord/commands` directory.

## `discord/commands/zond.js`

Here we find the utility directory with the zond.js file. There is a similar file for QRL commands in Discord.

This file is a nested slash command using the discord.js SlashCommandBuilder function. This puts all of the zond functions under one slash command `/zond` in Discord.

### Sub-commands

Sub-commands are located under the `addSubCommand` function

```js
module.exports = {
	cooldown: 3,
	data: new SlashCommandBuilder()
		.setName('zond')
		.setDescription('Zond testnet info!')
		// add sub-commands for various zond things here.

		// block returns the latest block from the node
		.addSubcommand(subcommand =>
			subcommand
				.setName('block')
				.setDescription('Get the current Zond block number'))
	
	// ...

	}

```

For each sub-command added to the bot, an additional module is required and must be included at the end of this file

```js
	async execute(interaction) {
	// ...
		if (!allowedChannels.includes(channelId) && !allowedGuilds.includes(interaction.guild.toString())) {
			// for each channel found in the allowedChannels list, append the <# and prepend > to the value
			const formattedChannels = allowedChannels.map(channel => `<#${channel}>\n`);

			console.log(`Ignoring command from disallowed channel: ${channelId}`);
			return await interaction.reply({ content: `Sorry, we cant use this channel to talk...\nPlease try again in an approved channel:\n${formattedChannels}`, ephemeral: true });
		}

		// subcommand "block" entered
		if (subCommand === 'block') {
			const blockLookup = require('../../modules/zond/zondBlock');
			blockLookup(interaction);
		}

```

## Module files

Modules are located in the `/src/discord/modules`


Here is the block file as an example. This file calls the API determined in the config file. This API is managed in the `/src/api` folder and is documented in the [API docs](./api.md)

```js
require('module-alias/register');

const axios = require('axios');
const { apiPort } = require('@config');

async function getBlockSub(interaction) {
	try {
		// Fetch the current block number from the API
		const response = await axios.get(`http://localhost:${apiPort}/v1/zond-block`);
		let blockNumber = 0;
		// Return the block number
		if (response.data.block.id === 1) {
			blockNumber = parseInt(response.data.block.result, 16);
			return await interaction.reply(`Latest Zond Block:\t\`${blockNumber}\``);
		}
		else {
			return await interaction.reply(`Cannot retrieve the BlockNumber at this time...\n\`${blockNumber}\``);
		}
	}
	catch (error) {
		// Handle the error
		const errorMessage = `Error occurred while fetching the block number: ${error.message}`;
		console.error(errorMessage);
		return await interaction.reply(`Looks like I'm struggling to complete that right now...\n\`${errorMessage}\``);
	}
}

module.exports = getBlockSub;

```

the module file calls to an API server with the endpoint identified here as /v1/zond-block. We pass the information needed for the command to the api server. 

We need to create that route and function behind it.

> see the [api server documentation](./api.md)for more information

## API Response data

The API response data from the call will be returned to the `/src/discord/modules/...` file for processing and response to the discord client.

This is where logic and validation happens for the commands for the most part. There is ample error checks throughout the app 

**Important** 

Each command needs to give a response to the discord client, even if the command fails overall, send that back. If not there is an ugly error that prints to the chat.

