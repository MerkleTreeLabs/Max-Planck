const getBlock = require('../../modules/block');
const getBalance = require('../../modules/balance');
const getTransaction = require('../../modules/transaction');
const helper = require('../../modules/helpers');
const { SlashCommandBuilder } = require('discord.js');
// const wait = require('node:timers/promises').setTimeout;

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

		// tx takes a transaction hash and returns some information to the user 0xc50e891a34eacedf2b3e6e7f4b245da2a2c6f5128f5de7419da41e1c54134040
		.addSubcommand(subcommand =>
			subcommand
				.setName('transaction')
				.setDescription('Zond transaction Lookup')
				.addStringOption(option => option.setName('txHash').setDescription('Zond transaction hash').setRequired(true).setMaxLength(66).setMinLength(66))
		)


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
			const blockNumber = await getBlock();
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
			const userAddress = interaction.options.getString('address');
			try {
				const validationResults = await helper.validateAddress(userAddress);
				if (validationResults.isValid) {
					let userBalance;
					if (interaction.options.getString('denomination') === 'wei') {
						userBalance = await getBalance(validationResults.address, 'wei');
					}
					else {
						userBalance = await getBalance(validationResults.address, 'quanta');
					}
					await interaction.reply(`Balance info:\nAddress:\t\`${userAddress}\`\nBalance:\t\`${userBalance}\``);
				}
				else {
					await interaction.reply(`Invalid address given:\t${validationResults.error}`);
				}
			}
			catch (error) {
				console.error('An error occurred during balance retrieval:', error);
				await interaction.reply('Looks like I\'m struggling to complete that right now...');
			}
		}
		else if (interaction.options.getSubcommand() === 'transaction') {
			console.log('transaction');
			const userTxHash = interaction.options.getString('txHash');
			try {
				const validationResults = await helper.validateTxHash(userTxHash);
				if (validationResults.isValid) {
					const txHashData = await getTransaction(validationResults.hash);
					await interaction.reply(`Transaction Data:\n${txHashData}`);
				}
				else {
					await interaction.reply(`Invalid txHash:\t${validationResults.error}`);
				}
			}
			catch (error) {
				console.error('An error occurred during Transaction retrieval:', error);
				await interaction.reply('Looks like I\'m struggling to complete that right now...');
			}
		}
		else if (interaction.options.getSubcommand() === 'faucet') {
			console.log('faucet');
			await interaction.reply('faucet');
		}
	},

};
