const helper = require('../../modules/helpers');
const sendFaucetTx = require('../api/faucet');
// const timestamp = new Date().getTime();
const { maxDrip } = require('../../config.json');
// const BigNumber = require('bignumber.js');

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

		await interaction.editReply('Drip sent. Thanks for supporting the QRL Zond Testnet!');
		// send user ephemeral message with details
		return await interaction.followUp({ content: `**Faucet Drip Details:**\n*Address To:*\t\`0x${validatedAddress}\`\n*Transaction Hash:*\t\`${transactionHash.result}\`\n*Amount:*\t\`${userAmount} quanta\``, ephemeral: true });
	}
	catch (error) {
		// there is an error sending the command
		const errorMessage = `Error occurred while attempting faucet drip: ${error.message}`;
		console.error(errorMessage);
		return await interaction.editReply(`Looks like I'm struggling to complete that right now...\n${errorMessage}`);
	}
}

module.exports = getFaucetSub;


/*
		// ------------------------------------

		// user lookup details variable
		let txDetails = { userFound: false, userInTimeout: false, partialDrip: false, timeElapsed: 0, amount: 0 };

		// lookup the user in the file we keep if found matching discord ID
		const userDiscovery = helper.userLookup(interaction.user.id);

		// is user found in file already?
		if (userDiscovery.isFound) {
			console.log(`user has been found: ${JSON.strinigfy(userDiscovery)}`);
			txDetails = { userFound: userDiscovery.isFound };

			// User found, check if faucet timeout has passed
			const timeElapsed = timestamp - userDiscovery.data.lastSeen;
			// if timeout is greater than time elapsed user in timeout
			if (parseInt(faucetTimeout) > timeElapsed) {
				// console.lgo(`timeout ${faucetTimeout} > ${timeElapsed}`);
				txDetails = { userInTimeout: true, timeElapsed };

				// check if the request is allotted based on last request and maxDrip
				const dripLeftAmount = helper.quantaToShor(parseInt(maxDrip)) - parseInt(userDiscovery.data.dripAmount);

				console.log(`Partial Drip: ${dripLeftAmount}`);

				if (dripLeftAmount > 0) {
					// they can have that much more
					txDetails = { partialDrip: true, amount: dripLeftAmount };
				}
			}
		}
		else {
			// user has not been seen
			txDetails = { amount: amountShor };
		}
		console.log(`txDetails:\t${JSON.stringify(txDetails)}`);

		// if found and not allowed error with message
		if (txDetails.userInTimeout) {
			if (!txDetails.partialDrip) {
				// in timeout and partial drip not allowed, send message with error
				return await interaction.reply(`Sorry, you will need to wait for the timeout to finish to request more.\nAnother ${helper.formatTime(parseInt(faucetTimeout) - parseInt(txDetails.timeElapsed))} for more.\nIf you need more than what I can give out, please email info@theqrl.org with some info on your needs!`);
			}
		}

		// send the transaction
		// start the bot reply while the tx sends
		await interaction.deferReply();
		const transactionHash = await sendFaucetTx(validatedAddress, amountShor);


		// build initial userInfo Array
		const userInfo = {
			discordId: interaction.user.id,
			discordName: interaction.user.username,
			lastSeen: timestamp,
			// dripAmount: amountShor,
		};

		// sort the user data file
		if (txDetails.userFound) {
			if (txDetails.userInTimeout) {
				// if we got here they were paid out a partial amount, add to their running balance and message
				userInfo.dripAmount = parseInt(userDiscovery.data.dripAmount) + parseInt(txDetails.amount);
				// lastSeen to stay the same
				userInfo.lastSeen = userDiscovery.data.lastSeen;
				// write to the user data file
				helper.writeUserData(userInfo);
				console.log(`txhash:\t${transactionHash.result}`);
				// send public message
				await interaction.editReply('Partial drip sent. More available after the timeout is done. Thanks for supporting the QRL Zond Testnet!');
				// send user ephemeral message with details
				return await interaction.followUp({ content: `**Faucet Drip Details:**\n*Address To:*\t${validatedAddress}\n*Transaction Hash:*\t\`${transactionHash.result}\`\n*Amount:*\t\`${helper.shorToQuanta(userInfo.dripAmount)}\`\nCome back in \`${helper.formatTime(parseInt(faucetTimeout) - parseInt(txDetails.timeElapsed))}\` for more!`, ephemeral: true });
			}
			else {
				// they waited long enough, update info and message
				userInfo.dripAmount = parseInt(txDetails.amount);
				// write to the user data file
				helper.writeUserData(userInfo);
				// send public message
				await interaction.editReply('Drip sent. Thanks for supporting the QRL Zond Testnet!');
				// send user ephemeral message with details
				return await interaction.followUp({ content: `**Faucet Drip Details:**\n*Address To:*\t\`${validatedAddress}\`\n*Transaction Hash:*\t\`${transactionHash.result}\`\n*Amount:*\t\`${helper.shorToQuanta(userInfo.dripAmount)}\`\nCome back in \`${helper.formatTime(faucetTimeout)}\` for more!`, ephemeral: true });
			}
		}
		else {
			// new user, write data and send message
			userInfo.dripAmount = parseInt(txDetails.amount);
			// write to the user data file
			helper.writeUserData(userInfo);
			console.log(`txhash:\t${transactionHash.result}`);
			// send public message
			await interaction.editReply('Drip sent. Thanks for supporting the QRL Zond Testnet!');
			// send user ephemeral message with details
			return await interaction.followUp({ content: `**Faucet Drip Details:**\n*Address To:*\t${validatedAddress}\n*Transaction Hash:*\t\`${transactionHash.result}\`\n*Amount:*\t\`${helper.shorToQuanta(userInfo.dripAmount)}\`\nCome back in \`${helper.formatTime(faucetTimeout)}\` for more!`, ephemeral: true });
		}

	}
	catch (error) {
		// there is an error sending the command
		const errorMessage = `Error occurred while attempting faucet drip: ${error.message}`;
		console.error(errorMessage);
		return await interaction.editReply(`Looks like I'm struggling to complete that right now...\n${errorMessage}`);
	}
}

module.exports = getFaucetSub;

*/
