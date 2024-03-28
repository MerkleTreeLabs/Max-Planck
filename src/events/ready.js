require('module-alias/register');
const { Events, ActivityType } = require('discord.js');
const { activityType, activityString, statusUpdate } = require('@config');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		// set username from config (un-comment to update bot, avoid rate limit)
		// client.user.setUsername(config.userName);
		// console.log(`username set to:\t${config.userName}`);
		// set avatar to config value
		// client.user.setAvatar(config.avatarImgLocation);
		// console.log(`Avatar set to:\t${config.avatarImgLocation}`);

		// set activity and string
		if (activityType === 'Watching') {
			client.user.setActivity(activityString, { type: ActivityType.Watching });
		}
		else if (activityType === 'Listening') {
			client.user.setActivity(activityString, { type: ActivityType.Listening });
		}
		else if (activityType === 'Competing') {
			client.user.setActivity(activityString, { type: ActivityType.Competing });
		}

		console.log(`Activity set to:\t${activityType} ${activityString}`);
		// set online status
		client.user.setStatus(statusUpdate);
		console.log(`Client status:\t${statusUpdate}`);


		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
