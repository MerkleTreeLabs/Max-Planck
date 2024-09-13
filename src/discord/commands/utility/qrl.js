require('module-alias/register');
const { SlashCommandBuilder } = require('discord.js');
const { allowedChannels, allowedGuilds } = require('@config');
const { bigIntToString } = require('@helper')

module.exports = {
	cooldown: 3,
	data: new SlashCommandBuilder()
		.setName('qrl')
		.setDescription('QRL Discord Bot!')

		// block returns the latest block from the node
		.addSubcommand(subcommand =>
			subcommand
				.setName('height')
				.setDescription('Get the current QRL block height'))


		// balance takes qrl address and returns the balance in ephemeral response
		.addSubcommand(subcommand =>
			subcommand
				.setName('balance')
				.setDescription('QRL address balance')
				.addStringOption(option => option
					.setName('address')
					.setDescription('QRL XMSS Public Address (Q..)')
					.setRequired(true)
					.setMaxLength(79)
					.setMinLength(79))
				.addStringOption(option => option
					.setName('denomination')
					.setDescription('Whether or not the balance should be in quanta or Shor (default quanta)')
					.addChoices(
						{ name: 'Shor', value: 'shor' },
						{ name: 'quanta', value: 'quanta' }),
				))


		// block takes a qrl block number or hash and returns block data
		//
		.addSubcommand(subcommand =>
			subcommand
				.setName('block')
				.setDescription('QRL block lookup')
				.addNumberOption(option => option
					.setName('number')
					.setDescription('QRL Block Number (15)')
					.setRequired(false)
					.setMaxValue(13276769)
					.setMinValue(1)),
		)


		// address takes a qrl address and returns summary data
		//
		.addSubcommand(subcommand =>
			subcommand
				.setName('address')
				.setDescription('QRL address Information')
				.addStringOption(option => option
					.setName('address')
					.setDescription('QRL XMSS Public Address (Q..)')
					.setRequired(true)
					.setMaxLength(79)
					.setMinLength(79)),
		)

		// tx takes a transaction hash and returns some information to the user
		.addSubcommand(subcommand =>
			subcommand
				.setName('transaction')
				.setDescription('QRL transaction Lookup')
				.addStringOption(option => option
					.setName('hash')
					.setDescription('QRL transaction hash')
					.setRequired(true)
					.setMaxLength(64)
					.setMinLength(64)),
		),

	/*
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
*/
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
		console.log(`Interaction Data:\t${JSON.stringify(interaction, bigIntToString)}`);

		// Check if the extracted channelId is in the allowedChannels list
		if (!allowedChannels.includes(channelId) && !allowedGuilds.includes(interaction.guild.toString())) {
			// for each channel found in the allowedChannels list, append the <# and prepend > to the value
			const formattedChannels = allowedChannels.map(channel => `<#${channel}>\n`);

			console.log(`Ignoring command from disallowed channel: ${channelId}`);
			return await interaction.reply({ content: `Sorry, we cant use this channel to talk...\nPlease try again in an approved channel:\n${formattedChannels}`, ephemeral: true });
		}

		// subcommand "height" entered
		if (subCommand === 'height') {
			const heightLookup = require('@qrl-utility-modules/qrlHeight');
			heightLookup(interaction);
		}
		// balance subcommand given
		else if (subCommand === 'balance') {
			const balanceLookup = require('@qrl-utility-modules/qrlBalance');
			balanceLookup(interaction);
		}

		// block subcommand given
		else if (subCommand === 'block') {
			const blockLookup = require('@qrl-utility-modules/qrlBlock');
			blockLookup(interaction);
		}

		// address subcommand given
		else if (subCommand === 'address') {
			const addressLookup = require('@qrl-utility-modules/qrlAddress');
			addressLookup(interaction);
		}
		// transaction subcommand
		else if (subCommand === 'transaction') {
			const transactionLookup = require('@qrl-utility-modules/qrlTransaction');
			transactionLookup(interaction);
		}
		/*

		// faucet called
		else if (subCommand === 'faucet') {
			const faucetRequest = require('../../modules/zond/zondFaucet');
			faucetRequest(interaction);
		}
		*/
	},

};
