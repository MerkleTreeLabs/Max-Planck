require('module-alias/register');

const axios = require('axios');
const BigNumber = require('bignumber.js');
const { apiPort } = require('@config');
const { validateZondAddress } = require('@helper');

async function getBalanceSub(interaction) {
	await interaction.deferReply();
	const userAddress = interaction.options.getString('address');
	try {
		const validationResults = await validateZondAddress(userAddress);
		if (validationResults.isValid) {
			const balanceResponse = await axios.post(`http://localhost:${apiPort}/v1/zond-balance`, { address: validationResults.address });
			const balanceValue = parseInt(balanceResponse.data.balance.result, 16);
			let userBalance = new BigNumber(balanceValue);

			if (interaction.options.getString('denomination') !== 'planck') {
				userBalance = userBalance.dividedBy('1e18').toFixed();
				await interaction.editReply(`Balance info:\nAddress:\t\`${userAddress}\`\nBalance:\t\`${userBalance} Q\``);
			}
			else {
				await interaction.editReply(`Balance info:\nAddress:\t\`${userAddress}\`\nBalance:\t\`${userBalance} Planck\``);
			}
		}
		else {
			await interaction.editReply(`Invalid address given:\t${validationResults.error}`);
		}
	}
	catch (error) {
		const errorMessage = `An error occurred during balance retrieval: ${error.message}`;
		console.error(errorMessage);
		await interaction.editReply(`Looks like I'm struggling to complete that right now...\n${errorMessage}`);
	}
}

module.exports = getBalanceSub;
