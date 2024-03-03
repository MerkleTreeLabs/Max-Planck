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
		console.log(interaction);

		// if each subcommand then process its stuff...
		if (interaction.options._subcommand.text.includes('ping')) {
			console.log('if');
		}
		else {
			console.log('else');
		}
		await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
	},

};
