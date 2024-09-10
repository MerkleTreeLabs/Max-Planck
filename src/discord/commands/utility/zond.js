require('module-alias/register');
const { SlashCommandBuilder } = require('discord.js');
const { maxDrip, allowedChannels, allowedGuilds } = require('@config');

function replacer(key, value) {
	if (typeof value === 'bigint') {
		return value.toString();
	}
	return value;
}

module.exports = {
	cooldown: 3,
	data: new SlashCommandBuilder()
		.setName('zond')
		.setDescription('Zond testnet info!')
		// add sub-commands for various zond things here.

		// height returns the latest block heightfrom the node
		.addSubcommand(subcommand =>
			subcommand
				.setName('height')
				.setDescription('Get the current Zond block height'))

		// balance takes zond address and returns the balance in ephemeral response
		.addSubcommand(subcommand =>
			subcommand
				.setName('balance')
				.setDescription('Zond address balance')
				.addStringOption(option => option
					.setName('address')
					.setDescription('Zond dilithium address (0x)')
					.setRequired(true)
					.setMaxLength(42)
					.setMinLength(42))
				.addStringOption(option => option
					.setName('denomination')
					.setDescription('Whether or not the balance should be in quanta or Shor (default quanta)')
					.addChoices(
						{ name: 'Planck', value: 'planck' },
						{ name: 'Q', value: 'q' }),
				))

		// tx takes a transaction hash and returns some information to the user 0xc50e891a34eacedf2b3e6e7f4b245da2a2c6f5128f5de7419da41e1c54134040
		.addSubcommand(subcommand =>
			subcommand
				.setName('transaction')
				.setDescription('Zond transaction Lookup')
				.addStringOption(option => option
					.setName('hash')
					.setDescription('Zond transaction hash')
					.setRequired(true)
					.setMaxLength(66)
					.setMinLength(66)),
		)

		// faucet gives the requested amount to user
		.addSubcommand(subcommand =>
			subcommand
				.setName('faucet')
				.setDescription('Zond transaction Lookup')
				.addStringOption(option => option
					.setName('address')
					.setDescription('Zond dilithium address')
					.setRequired(true)
					.setMaxLength(42)
					.setMinLength(42))
				.addNumberOption(option => option
					.setName('amount')
					.setDescription('Amount of testnet quanta to receive')
					.setRequired(true)
					.setMaxValue(parseInt(maxDrip)))),

	async execute(interaction) {
		// do nothing if not a command that we know
		//
		// IMPROVEMENT: Add function to respond to unfinished interactions with some help
		// 				Add function to respond to direct @
		//
		if (!interaction.isCommand()) return;
		const timestamp = new Date().getTime();

		const userData = {
			discordId: interaction.user.id,
			discordName: interaction.user.username,
			timestamp,
		};
		const subCommand = interaction.options.getSubcommand();
		// Extract the channel ID from the interaction.channel_id
		const channelId = interaction.channelId.toString();

		// console.log(`interaction channel: ${interaction.channel}`);
		// console.log(`User ${userData.discordName} called subcommand ${subCommand}. ${JSON.stringify(userData)}\nData: ${interaction}`);


		console.log(`Interaction received from User:\t${userData.discordName}`);
		console.log(`Timestamp:\t${timestamp}`);
		console.log(`Subcommand:\t${subCommand}`);
		console.log(`Channel ID:\t${channelId}`);
		console.log(`Guild Name:\t${interaction.guild ? interaction.guild.name : 'DM'}`);
		console.log(`Interaction Data:\t${JSON.stringify(interaction, replacer)}`);

		// Check if the extracted channelId is in the allowedChannels list
		if (!allowedChannels.includes(channelId) && !allowedGuilds.includes(interaction.guild.toString())) {
			// for each channel found in the allowedChannels list, append the <# and prepend > to the value
			const formattedChannels = allowedChannels.map(channel => `<#${channel}>\n`);

			console.log(`Ignoring command from disallowed channel: ${channelId}`);
			return await interaction.reply({ content: `Sorry, we cant use this channel to talk...\nPlease try again in an approved channel:\n${formattedChannels}`, ephemeral: true });
		}

		// subcommand "height" entered
		if (subCommand === 'height') {
			const blockLookup = require('../../modules/zond/zondHeight');
			blockLookup(interaction);
		}

		// balance subcommand given
		else if (subCommand === 'balance') {
			const balanceLookup = require('../../modules/zond/zondBalance');
			balanceLookup(interaction);
		}

		// transaction subcommand
		else if (subCommand === 'transaction') {
			const transactionLookup = require('../../modules/zond/zondTransaction');
			transactionLookup(interaction);
		}

		// faucet called
		else if (subCommand === 'faucet') {
			const faucetRequest = require('../../modules/zond/zondFaucet');
			faucetRequest(interaction);
		}
	},

};
