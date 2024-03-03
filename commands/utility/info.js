const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 3,
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Zond testnet info!')
		.addSubcommand(subcommand =>
			subcommand
				.setName('user')
				.setDescription('Info about a user')
				.addUserOption(option => option.setName('target').setDescription('The user')))
		.addSubcommand(subcommand =>
			subcommand
				.setName('server')
				.setDescription('Info about the server')),


	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		console.log(interaction);
		await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
	},

};
