const block = require('../../modules/block');
const balance = require('../../modules/balance');
const helper = require('../../modules/helpers');
const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

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
		// balance takes zond address and returns the balance in ephemeral response
		.addSubcommand(subcommand =>
			subcommand
				.setName('balance')
				.setDescription('Zond address balance')
				.addStringOption(option => option.setName('address').setDescription('Zond dilithium address (0x)').setRequired(true).setMaxLength(42).setMinLength(42))
				.addStringOption(option => option.setName('denomination').setDescription('Whether or not the balance should be in quanta or Wei (default quanta)')
					.addChoices({ name: 'Wei', value: 'wei' }, { name: 'quanta', value: 'quanta' }),
				),
		)

		// tx takes a transaction hash and returns some information to the user
		.addSubcommand(subcommand =>
			subcommand
				.setName('transaction')
				.setDescription('Zond address balance'))
		// faucet gives the requested amount to user
		.addSubcommand(subcommand =>
			subcommand
				.setName('faucet')
				.setDescription('Zond address balance')),

	async execute(interaction) {
		if (!interaction.isCommand()) return;

		// subcommand "block" entered
		if (interaction.options.getSubcommand() === 'block') {
			// get the block data
			const blockNumber = await block();
			// return the block number
			if (blockNumber) {
				await interaction.reply(`Latest Block:\t${blockNumber}`);
			}
			else {
				await interaction.reply(`'Cannot retrieve the BlockNumber at this time...\n${blockNumber}'`);
			}
		}

		// balance subcommand given
		else if (interaction.options.getSubcommand() === 'balance') {
			console.log('balance');
			const userAddress = interaction.options.getString('address');
			try {
				const validationResults = await helper.validate(userAddress);
				if (validationResults.isValid) {
					console.log('Address is valid:', validationResults.address);
					// grab the balance and return to the user
					let userBalance;
					if (interaction.options.getString('denomination') === 'wei') {
						userBalance = await balance(validationResults.address, 'wei');
					}
					else {
						userBalance = await balance(validationResults.address, 'quanta');
					}
					// return the address balance to the user
					await interaction.reply(`Balance info:\nAddress:\t\`${userAddress}\`\nBalance:\t\`${userBalance}\``);
				}
				else {
					// invalid address given
					await interaction.reply(`Invalid address given:\t${validationResults.error}`);
				}
			}
			catch (error) {
				console.error('An error occurred during balance retrieval:', error);
				await interaction.reply('Looks like I\'m struggleing to complete that right now...');
			}
		}
		else if (interaction.options.getSubcommand() === 'transaction') {
			console.log('transaction');
			await interaction.reply('transaction');
		}
		else if (interaction.options.getSubcommand() === 'faucet') {
			console.log('faucet');
			await interaction.reply('faucet');
		}

		const response = await interaction;
		console.log(response.options.getSubcommand());
		// if each subcommand then process its stuff...
		if (response.options._subcommand === 'ping') {
			console.log('if');
			response.deferReply({ ephemeral: true });
			await wait(2000);
			await interaction.editReply('Pong called!!');
		}
		else {
			console.log('else');
		}
	},

};
