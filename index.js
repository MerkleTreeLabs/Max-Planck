const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.cooldowns = new Collection();
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
console.log(commandFolders);
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.adminComands = new Collection();

const adminFoldersPath = path.join(__dirname, 'admin');
const adminCommandFolders = fs.readdirSync(adminFoldersPath);
console.log(adminCommandFolders);
for (const adminFolder of adminCommandFolders) {
	const adminCommandsPath = path.join(adminFoldersPath, adminFolder);
	const adminCommandFiles = fs.readdirSync(adminCommandsPath).filter(adminFile => adminFile.endsWith('.js'));
	for (const adminFile of adminCommandFiles) {
		const adminFilePath = path.join(adminCommandFiles, adminFile);
		const adminCommand = require(adminFilePath);
		if ('data' in adminCommand && 'execute' in adminCommand) {
			client.adminComands.set(adminCommand.data.name, adminCommand);
		}
		else {
			console.log(`[WARNING] The admin command at ${adminFilePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}
client.login(token);
