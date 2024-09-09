require('module-alias/register');

const axios = require('axios');
const BigNumber = require('bignumber.js');
const { apiPort } = require('@config');
const helper = require('@helper');

async function getBalanceSub(interaction) {
	const userAddress = interaction.options.getString('address');
	try {
		//
		// create a qrl address check helper that returns the address as expected for the command
		//
		//
		//
		const validationResults = await helper.validateQRLAddress(userAddress);
		if (validationResults.isValid) {
			console.log('valid address given');

			// create a qrl-balance file
			const balanceResponse = await axios.post(`http://localhost:${apiPort}/v1/qrl-balance`, { address: `Q${validationResults.address}` });
			console.log(`balanceResponse: ${JSON.stringify(balanceResponse.data)}`);

			const balanceValue = parseInt(balanceResponse.data.balance.balance);
			let userBalance = new BigNumber(balanceValue);

			if (interaction.options.getString('denomination') !== 'shor') {
				userBalance = userBalance.dividedBy('1e9').toFixed();
				await interaction.reply(`Balance info:\nAddress:\t\`${userAddress}\`\nBalance:\t\`${userBalance} quanta\``);
			}
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
