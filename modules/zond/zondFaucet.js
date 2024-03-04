const helper = require('../../modules/helpers');
const sendFaucetTx = require('../api/faucet');
const timestamp = new Date().getTime();
const { faucetTimeout, maxDrip } = require('../../config.json');
// const BigNumber = require('bignumber.js');


async function getFaucetSub(interaction) {
	const userAddress = interaction.options.getString('address');
	const userAmount = interaction.options.getNumber('amount');
	try {
		const validationResults = await helper.validateAddress(userAddress);
		if (validationResults.isValid) {
			const amountShor = await helper.quantaToShor(userAmount);
			const validatedAddress = validationResults.address;
			// console.log(`amountShor:\t${amountShor}`);

			const userInfo = {
				discordId: interaction.user.id,
				discordName: interaction.user.username,
				lastSeen: timestamp,
				dripAmount: amountShor,
			};


			// user lookup
			let txDetails;

			const userDiscovery = helper.userLookup(userInfo);
			console.log(JSON.stringify(userDiscovery))
			if (userDiscovery.isFound) {
				// check if faucet timeout has passed
				const now = new Date().getTime();
				const timeElapsed = now - userDiscovery.lastSeen;

				console.log(typeof now)
				console.log(typeof userDiscovery.lastSeen)
				console.log(typeof parseInt(faucetTimeout))
				console.log(typeof timeElapsed)


				if (timeElapsed >= parseInt(faucetTimeout)) {
					// timeout has occurred, they can have more
					// send tx details and pass
					userInfo.lastSeen = now;
					userInfo.dripAmount = amountShor;
					const timeLeft = helper.formatTime(parseInt(faucetTimeout));
					console.log(`timeLeft:\t${timeLeft}`)
					txDetails = { dripAllowed: true, address: validatedAddress, amount: amountShor, reason: `Enough time has passes since the last time you asked, next timeout expires in ${timeLeft}.`, userInfo };
				}
				else {
					// time is not up yet, is there any available funds left to give?
					const dripAmountBalance = maxDrip - userDiscovery.dripAmount;
					if (dripAmountBalance > 0) {
						// there is available balance to send
						if (dripAmountBalance >= amountShor) {
							userInfo.lastSeen = now;
							userInfo.dripAmount = amountShor;
							const timeLeft = helper.formatTime(parseInt(faucetTimeout));
							txDetails = { dripAllowed: true, address: validatedAddress, amount: amountShor, reason: `Amount requested is available now. The next timeout expires in ${timeLeft}.` };
						}
						else {
							// give the remaining balance available since they asked for more than they can have right now
							txDetails = { dripAllowed: true, address: validatedAddress, amount: dripAmountBalance, reason: 'The amount requested is more than the available drip amount. I\'ve given all I can at this time.' };
							// update userInfo
							userInfo.lastSeen = now;
							userInfo.dripAmount = userDiscovery.dripAmount + dripAmountBalance;
						}
					}
					else {
						// no funds left to give till the time is up again
						const timeLeft = helper.formatTime(parseInt(faucetTimeout) - timeElapsed);
						txDetails = { dripAllowed: false, reason: `You need to wait until the timeout is up in ${timeLeft}.\nIf you have an immediate need please email info@theqrl.org with your request and it will be responded to...` };
					}
				}
			}
			else {
				// user is not found. Collect their info and write it to the file.
				txDetails = { dripAllowed: true, address: validatedAddress, amount: amountShor, reason: 'First time request, sending entire request.' };
			}

			// if the dripAllowed function is true send tx
			if (txDetails.dripAllowed) {
				const transactionHash = await sendFaucetTx(validatedAddress, amountShor);
				// Update user info in the file
				helper.writeUserData(userInfo);
				return await interaction.reply(`${txDetails.reason}\n**Transaction Hash:**\t${transactionHash}`);
			}
			else {
				// respond to user with reason
				return await interaction.reply(txDetails.reason);
			}
		}
		else {
			// user address is incorrect somehow
			return await interaction.reply(`There was an error with the address given\n${validationResults.error}`);
		}
	}
	catch (error) {
		console.error('Error occurred during function', error);
	}
}

module.exports = getFaucetSub;
