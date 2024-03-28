const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('../config.json');
const rest = new REST().setToken(token);

// pass empty array to remove all commands from the bot.

// strip the args to user only
const args = process.argv.slice(2);


if (args[0] === 'guild') {
	if (!args[1] && guildId) {
		console.log(`guild ID not passed, using default from the config ${guildId}`);
	}
	else {
		console.log('!!ERROR!!: No guild ID given.\n\nGuild ID number is required and can be found\nin the guild you are trying to remove commands from.\n(Check the right click on guild name)\n\nDefine this in the config.json file or in command argument here');
		process.exit(1);
	}

	// set the guild ID to the user arg passed or the settings value
	const { guildIdUsed = args[1] } = guildId;

	// for guild-based commands
	rest.put(Routes.applicationGuildCommands(clientId, guildIdUsed), { body: [] })
		.then(() => console.log('Successfully deleted all guild commands.'))
		.catch(console.error);
}
else if (args[0] === 'client') {
	if (!args[1] && clientId) {
		console.log(`client ID not passed, using default from the config ${typeof clientId}`);
	}
	else {
		console.log('!!ERROR!!: No client ID given.\nClient ID number is required and can be found\nin the discord developer dashboard https://discord.com/developers/applications\n\nDefine this in the config.json file or in command argument here');
		process.exit(1);
	}
	// grab the clientID from the config or from the command line. Fail if none given
	const { clientIdSelected = args[1] } = clientId;
	console.log(clientIdSelected);
	// for global commands
	rest.put(Routes.applicationCommands(clientIdSelected), { body: [] })
		.then(() => console.log('Successfully deleted all application commands.'))
		.catch(console.error);
}
else {
	console.log('User Args:\narg 1:\nclient {ClientID}\t\t- Removes all client commands from all guilds. Provide clientId in config or here.\nguild {GuildID}\t- Removes all commands from the given guild.');
}

/*
// for guild-based commands
rest.delete(Routes.applicationGuildCommand(clientId, guildId, 'commandId'))
	.then(() => console.log('Successfully deleted guild command'))
	.catch(console.error);

// for global commands
rest.delete(Routes.applicationCommand(clientId, 'commandId'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);
*/
