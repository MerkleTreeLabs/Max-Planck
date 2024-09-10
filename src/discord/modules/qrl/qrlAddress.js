require('module-alias/register');

const axios = require('axios');
const { knownQrlAddresses, apiPort } = require('@config');
const helper = require('@helper');


async function getAddressSub(interaction) {
	const userAddress = interaction.options.getString('address');
	try {
		// check the address for valid length and format
		const validationResults = await helper.validateQRLAddress(userAddress);
		if (validationResults.isValid) {
			console.log(`address: Q${validationResults.address}`);
			// get the address data from the chain
			const otsResponse = await axios.post(`http://localhost:${apiPort}/v1/qrl-ots`, { address: `Q${validationResults.address}` });
			const balanceResponse = await axios.post(`http://localhost:${apiPort}/v1/qrl-balance`, { address: `Q${validationResults.address}` });
			console.log(otsResponse.data);
			console.log(balanceResponse.data);
			// lookup the validated address in the list of known addresses.
			const foundAddress = knownQrlAddresses.find(addrObj => addrObj.address === `Q${validationResults.address}`);
			const nextOTS = otsResponse.data.data.next_unused_ots_index ? otsResponse.data.data.next_unused_ots_index : 0;


			if (foundAddress) {
				await interaction.reply(`**QRL Address Info**
						Balance: \`${helper.shorToQuanta(balanceResponse.data.balance.balance)}\`
						Last Used OTS: \`${nextOTS}\`
						> *Address is known: __${foundAddress.owner}__ owns [${helper.truncateHash(foundAddress.address, 6, 6)}](https://explorer.theqrl.org/a/${foundAddress.address})*
					`);
			}
			else {
				await interaction.reply(`**QRL Address Info:** [Q${helper.truncateHash(validationResults.address, 5, 6)}](https://explorer.theqrl.org/a/q${validationResults.address})
							Balance: \`${helper.shorToQuanta(balanceResponse.data.balance.balance)}\`
							Last Used OTS: \`${nextOTS}\`
						`);
			}
		}
		else {
			await interaction.reply(`Invalid address given:\t${validationResults.error}`);
		}
	}
	catch (error) {
		const errorMessage = `An error occurred during address data retrieval: ${error.message}`;
		console.error(errorMessage);
		await interaction.reply(`Looks like I'm struggling to complete that right now...\n${errorMessage}`);
	}
}

module.exports = getAddressSub;
