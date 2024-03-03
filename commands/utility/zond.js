const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 3,
	data: new SlashCommandBuilder()
		.setName('zond')
		.setDescription('Zond testnet info!')
		// add sub-commands for various zond things here.
		.addSubcommand(subcommand =>
			subcommand
				.setName('block')
				.setDescription('Get current block number'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('ping')
				.setDescription('ping user')),

	async execute(interaction) {
		await interaction
			.then((response) => {
				console.log(response.options._subcommand);
				// if each subcommand then process its stuff...
				if (response.options._subcommand === 'ping') {
					console.log('if');
				}
				else {
					console.log('else');
				}
			});
	},

};
