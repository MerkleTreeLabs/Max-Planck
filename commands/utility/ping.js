const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	cooldown: 30,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
// allows an immediate reply
//		await interaction.reply('Pong!');

// allows an edited response after initial (limit of 15 min max)
//		await interaction.reply('Pong!');
//		await wait(2_000);
//		await interaction.editReply('Pong again!');

// allows a defered response to do stuff. 15 min max window
		await interaction.deferReply();

// ephemeral reply
//		await interaction.deferReply({ ephemeral: true });

		await wait(4000);
		await interaction.editReply('Pong!');

// follow up within 15 min of og post
//		await interaction.followUp({ content: 'Pong again!', ephemeral: true });
// or
//		await interaction.followUp('Pong again!');

// delete the initial reply
//		await interaction.deleteReply();

// message object to return reactions etc...
		const message = await interaction.fetchReply();
		console.log('message Object:\t' + message);
	},
};
