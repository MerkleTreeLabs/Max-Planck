const BigNumber = require('bignumber.js');
const getBalance = require('../api/balanceLookup');
const helper = require('../helpers');


async function getBalanceSub(interaction) {
	const userAddress = interaction.options.getString('address');
	try {
		const validationResults = await helper.validateAddress(userAddress);
		if (validationResults.isValid) {
			let userBalance;

			// Get the balance from the API
			const balanceResponse = await getBalance(validationResults.address);
			// Convert the balance to string
			const balanceValue = balanceResponse.toString();

			// Convert the balance value to BigNumber
			userBalance = new BigNumber(balanceValue);

			// If the denomination is not shor, divide the balance by 1e18
			if (interaction.options.getString('denomination') !== 'shor') {
				userBalance = userBalance.dividedBy('1e18').toFixed();
				// Reply with the balance information in Shor
				await interaction.reply(`Balance info:\nAddress:\t\`${userAddress}\`\nBalance:\t\`${userBalance} Shor\``);
			}
			else {
				// Reply with the balance information in quanta (whole)
				await interaction.reply(`Balance info:\nAddress:\t\`${userAddress}\`\nBalance:\t\`${userBalance} quanta\``);
			}
		}
		else {
			await interaction.reply(`Invalid address given:\t${validationResults.error}`);
		}
	}
	catch (error) {
		const errorMessage = `An error occurred during balance retrieval: ${error.message}`;
		console.error(errorMessage);
		await interaction.reply(`Looks like I'm struggling to complete that right now...\n${errorMessage}`);
	}
}

module.exports = getBalanceSub;
