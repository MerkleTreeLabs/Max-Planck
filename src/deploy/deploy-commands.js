require('module-alias/register');
const { REST, Routes } = require('discord.js');
const { clientId, token } = require('@config');
const fs = require('fs');
const path = require('path');

// Define the absolute path to the commands directory
const commandFoldersPath = path.join(__dirname, '..', 'commands');

const commands = [];

// Read all the command folders from the commands directory
const commandFolders = fs.readdirSync(commandFoldersPath);

for (const folder of commandFolders) {
	// Construct the absolute path to each command folder
	const commandsPath = path.join(commandFoldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	// Iterate over each command file in the folder
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Initialize the REST module with the provided token
const rest = new REST({ version: '9' }).setToken(token);

// Deploy the commands
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		console.error(error);
	}
})();
