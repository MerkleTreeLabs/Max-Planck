require('module-alias/register');

const axios = require('axios');
// const BigNumber = require('bignumber.js');
const { apiPort } = require('@config');
const helper = require('@helper');
const { hideLinkEmbed } = require('discord.js');

async function getBlockSub(interaction) {
	try {
		let lookupBlock = 0;
		const currentHeight = await axios.get(`http://localhost:${apiPort}/v1/qrl-height`);
		const userBlock = interaction.options.getNumber('number');

		// no block given or undefined, use the current block
		if (userBlock == null) {
			if (!currentHeight.data.success) {
				// return a response so the discord API is happy
				return await interaction.reply('There is an issue looking up the Block Height at this time...');
			}
			// set the lookup block to the current block
			lookupBlock = parseInt(currentHeight.data.height.height);
		}
		else {
			// use the user-given block
			if (parseInt(currentHeight.data.height.height) < parseInt(userBlock)) {
				// if the current block is less than the user block, return an error
				return await interaction.reply(`Sorry, I can't do that... The block requested is in the future!\`Latest: ${currentHeight.data.height.height} Request: ${userBlock}\``);
			}
			lookupBlock = parseInt(userBlock);
		}

		// lookup the block data
		const blockResponse = await axios.post(`http://localhost:${apiPort}/v1/qrl-block-by-number`, { block: `${lookupBlock}` });
		const transactionCount = parseInt(blockResponse.data.block.transactions.length) - 1;
		let totalTransferred = 0;
		let coinBaseAddress = '';
		let coinBaseAmount = 0;

		// Loop through the transactions array
		blockResponse.data.block.transactions.forEach((transaction, index) => {
			const coinbase = transaction.coinbase ? transaction.coinbase : null;
			const transfer = transaction.transfer ? transaction.transfer : null;

			// tally some info on the transactions in the block
			if (coinbase) {
				coinBaseAddress = coinbase.addr_to;
				coinBaseAmount = coinbase.amount;
			}
			// Sum up the transferred amounts if it's not a coinbase transaction
			if (transfer && transfer.amounts) {
				transfer.amounts.forEach((amount) => {
					totalTransferred += parseInt(amount, 10);
				});
			}
		});

		const url = `https://explorer.theqrl.org/block/${blockResponse.data.block.header.block_number}`;
		const explorerLink = hideLinkEmbed(url);

		// send the reply to the channel
		await interaction.reply(`
			Here's the QRL block data:\n> __**block_number:**__ \`${blockResponse.data.block.header.block_number}\`
				> **hash_header:** \`${helper.truncateHash(blockResponse.data.block.header.hash_header)}\`
				> **timestamp_seconds:** \`${blockResponse.data.block.header.timestamp_seconds}\`
				> **hash_header_prev:** \`${helper.truncateHash(blockResponse.data.block.header.hash_header_prev)}\`
				> **reward_block:** \`${blockResponse.data.block.header.reward_block}\`
				> **reward_fee:** \`${blockResponse.data.block.header.reward_fee}\`
				> **merkle_root:** \`${helper.truncateHash(blockResponse.data.block.header.merkle_root)}\`
				> **mining_nonce:** \`${blockResponse.data.block.header.mining_nonce}\`
				> **transaction_count:** \`${transactionCount}\`
				> **total_transfered:** \`${helper.shorToQuanta(totalTransferred)}\`
				> **payout_address:** \`${helper.truncateHash(coinBaseAddress, 6, 6)}\`
				> **mining_reward:** \`${helper.shorToQuanta(coinBaseAmount)}\`\nMore info ${explorerLink}`,
		);
	}
	catch (error) {
		const errorMessage = `An error occurred during block retrieval: ${error.message}`;
		console.error(errorMessage);
		await interaction.reply(`Looks like I'm struggling to complete that block request right now...${errorMessage}`);
	}
}

module.exports = getBlockSub;
