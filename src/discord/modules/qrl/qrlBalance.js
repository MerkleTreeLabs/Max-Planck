require('module-alias/register');

const axios = require('axios');
const BigNumber = require('bignumber.js');
const { apiPort } = require('@config');
const helper = require('@helper');

async function getBalanceSub(interaction) {
	const userAddress = interaction.options.getString('address');
	try {
		// check the address for valid length and format
		const validationResults = await helper.validateQRLAddress(userAddress);
		if (validationResults.isValid) {
			// get the balance from the chain
			const balanceResponse = await axios.post(`http://localhost:${apiPort}/v1/qrl-balance`, { address: `Q${validationResults.address}` });
			const balanceValue = parseInt(balanceResponse.data.balance.balance);
			let userBalance = new BigNumber(balanceValue);
			// if they want it in shor
			if (interaction.options.getString('denomination') !== 'shor') {
				userBalance = userBalance.dividedBy('1e9').toFixed();
				await interaction.reply(`Balance info:\nAddress:\t\`${userAddress}\`\nBalance:\t\`${userBalance} quanta\``);
			}
			// default returns quanta
			else {
				await interaction.reply(`Balance info:\nAddress:\t\`${userAddress}\`\nBalance:\t\`${userBalance} Shor\``);
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
