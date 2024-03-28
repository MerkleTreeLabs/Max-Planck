require('module-alias/register');

const BigNumber = require('bignumber.js');

const helper = require('@helper');
const { maxDrip } = require('@config');
const sendFaucetTx = require('@zond-chain/faucet');

const timestamp = new Date().getTime();

async function getFaucetSub(interaction) {
	const userAddress = interaction.options.getString('address');
	const userAmount = interaction.options.getNumber('amount');
	try {
		// check if user address is valid
		const addressValidationResults = await helper.validateAddress(userAddress);

		// check submitted address format is valid
		if (!addressValidationResults.isValid) {
			return await interaction.reply(`There was an error with the address given\n${addressValidationResults.error}`);
		}

		// address is valid and assigned this value
		const validatedAddress = addressValidationResults.address;

		// check requested amount is not more than allowed
		if (userAmount > maxDrip) {
			// amount requested is more than allowed
			return await interaction.reply(`The amount requested *{${userAmount} quanta}* is more than allowed *{${maxDrip} quanta}*.\n${addressValidationResults.error}`);
		}

		// convert quanta to Shor
		const amountShor = await helper.quantaToShor(userAmount);

		// send the transaction
		// start the bot reply while the tx sends
		await interaction.deferReply();
		const transactionHash = await sendFaucetTx(validatedAddress, amountShor);

		// write user data to file
		const userData = {
			discordId: interaction.user.id,
			discordName: interaction.user.username,
			timestamp,
		};
		try {
			helper.writeUserData(userData);
		}
		catch (error) {
			console.log(`error attempting to write to the userlog:\t${error}`);
		}

		const formattedAmount = new BigNumber(userAmount).toFixed();
		await interaction.editReply('Drip sent. Thanks for supporting the QRL Zond Testnet!');
		// send user ephemeral message with details
		return await interaction.followUp({ content: `**Faucet Drip Details:**\n*Address To:*\t\`0x${validatedAddress}\`\n*Transaction Hash:*\t\`${transactionHash.result}\`\n*Amount:*\t\`${formattedAmount} quanta\``, ephemeral: true });
	}
	catch (error) {
		// there is an error sending the command
		const errorMessage = `Error occurred while attempting faucet drip: ${error.message}`;
		console.error(errorMessage);
		return await interaction.editReply(`Looks like I'm struggling to complete that right now...\n${errorMessage}`);
	}
}

module.exports = getFaucetSub;
