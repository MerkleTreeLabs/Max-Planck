const getBalance = require('../api/balanceLookup');
const helper = require('../helpers');


async function getBalanceSub(interaction) {
	const userAddress = interaction.options.getString('address');
	try {
		const validationResults = await helper.validateAddress(userAddress);
		if (validationResults.isValid) {
			let userBalance;
			if (interaction.options.getString('denomination') === 'wei') {
				userBalance = await getBalance(validationResults.address);
			}
			else {
				userBalance = await getBalance(validationResults.address);

				userBalance = parseInt(userBalance).dividedBy('1e18').toFixed();

			}
			await interaction.reply(`Balance info:\nAddress:\t\`${userAddress}\`\nBalance:\t\`${userBalance}\``);
		}
		else {
			await interaction.reply(`Invalid address given:\t${validationResults.error}`);
		}
	}
	catch (error) {
		const errorMessage = `An error occurred during balance retrieval: ${error.message}`;
		console.error(errorMessage);
		return await interaction.reply(`Looks like I'm struggling to complete that right now...\n${errorMessage}`);
	}
}

module.exports = getBalanceSub;
