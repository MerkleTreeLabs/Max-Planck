const block = require('../../modules/block');
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
				.setDescription('Get current block number'))
		// balance takes zond address and returns the balance in ephemeral response
		.addSubcommand(subcommand =>
			subcommand
				.setName('balance')
				.setDescription('Zond address balance'))
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
		if (interaction.options.getSubcommand() === 'block') {
			// get the block data

			const blockNumber = await block();
			const user = interaction.options.getUser('target');
			// return the block number
			if (blockNumber) {
				await interaction.reply(`Latest Block:\t${blockNumber}`);
				console.log(user);
			}
			else {
				await interaction.reply(`Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`);
			}
		}

		else if (interaction.options.getSubcommand() === 'balance') {
			console.log('balance');
			await interaction.reply('balance');
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
