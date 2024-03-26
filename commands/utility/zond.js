const { SlashCommandBuilder } = require('discord.js');
const { maxDrip } = require('../../config.json');

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
				.addStringOption(option => option
					.setName('address')
					.setDescription('Zond dilithium address (0x)')
					.setRequired(true)
					.setMaxLength(42)
					.setMinLength(42))
				.addStringOption(option => option
					.setName('denomination')
					.setDescription('Whether or not the balance should be in quanta or Wei (default quanta)')
					.addChoices(
						{ name: 'Wei', value: 'wei' },
						{ name: 'quanta', value: 'quanta' }),
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
		if (!interaction.isCommand()) return;

		// subcommand "block" entered
		if (interaction.options.getSubcommand() === 'block') {
			const blockLookup = require('../../modules/zond/zondBlock');
			blockLookup(interaction);
		}

		// balance subcommand given
		else if (interaction.options.getSubcommand() === 'balance') {
			const balanceLookup = require('../../modules/zond/zondBalance');
			balanceLookup(interaction);
		}

		// transaction subcommand
		else if (interaction.options.getSubcommand() === 'transaction') {
			const transactionLookup = require('../../modules/zond/zondTransaction');
			transactionLookup(interaction);
		}

		// faucet called
		else if (interaction.options.getSubcommand() === 'faucet') {
			const faucetRequest = require('../../modules/zond/zondFaucet');
			faucetRequest(interaction);
		}
	},

};
