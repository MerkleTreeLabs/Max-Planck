const { Events, ActivityType } = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		// set username from config
//		client.user.setUsername(config.userName);
//		console.log(`username set to:\t${config.userName}`);
		// set avatar to config value
//		client.user.setAvatar(config.avatarImgLocation);
//		console.log(`Avatar set to:\t${config.avatarImgLocation}`);

		// set activity and string
		const activityType = config.activityType;
		const activityString = config.activityString;

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
		client.user.setStatus(config.statusUpdate);
		console.log(`Client status:\t${config.statusUpdate}`);


		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
