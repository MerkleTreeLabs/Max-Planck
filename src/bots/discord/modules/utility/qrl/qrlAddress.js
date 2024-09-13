require('module-alias/register');
const axios = require('axios');
const { knownQrlAddresses, apiPort } = require('@config');
const { validateQRLAddress, shorToQuanta, truncateHash } = require('@helper');

async function getAddressSub(interaction) {
	await interaction.deferReply();
	const userAddress = interaction.options.getString('address');
	try {
		// check the address for valid length and format
		const validationResults = await validateQRLAddress(userAddress);
		if (validationResults.isValid) {
			// get the address data from the chain
			const otsResponse = await axios.post(`http://localhost:${apiPort}/v1/qrl-ots`, { address: `Q${validationResults.address}` });
			const balanceResponse = await axios.post(`http://localhost:${apiPort}/v1/qrl-balance`, { address: `Q${validationResults.address}` });
			// lookup the validated address in the list of known addresses.
			const foundAddress = knownQrlAddresses.find(addrObj => addrObj.address === `Q${validationResults.address}`);
			const nextOTS = otsResponse.data.next_unused_ots_index ? otsResponse.data.next_unused_ots_index : 0;


			if (foundAddress) {
				await interaction.editReply(`**QRL Address Info**
						Balance: \`${shorToQuanta(balanceResponse.data.balance)}\`
						Next OTS Index: \`${nextOTS}\`
						> *Address is known: __${foundAddress.owner}__ owns [${truncateHash(foundAddress.address, 6, 6)}](https://explorer.theqrl.org/a/${foundAddress.address})*
					`);
			}
			else {
				await interaction.editReply(`**QRL Address Info:** [Q${truncateHash(validationResults.address, 5, 6)}](https://explorer.theqrl.org/a/q${validationResults.address})
							Balance: \`${shorToQuanta(balanceResponse.data.balance)}\`
							Last Used OTS: \`${nextOTS}\`
						`);
			}
		}
		else {
			await interaction.editReply(`Invalid address given:\t${validationResults.error}`);
		}
	}
	catch (error) {
		const errorMessage = `An error occurred during address data retrieval: ${error.message}`;
		console.error(errorMessage);
		await interaction.editReply(`Looks like I'm struggling to complete that right now...\n${errorMessage}`);
	}
}

module.exports = getAddressSub;
