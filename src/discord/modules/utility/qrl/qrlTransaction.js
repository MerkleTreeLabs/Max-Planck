const axios = require('axios');
const { apiPort } = require('@config');
const { decodeNotarizationMessage, truncateHash, validateQrlTxHash, shorToQuanta } = require('@helper');
const { hideLinkEmbed } = require('discord.js');

async function getTransactionSub(interaction) {
	await interaction.deferReply();
	const userTxHash = interaction.options.getString('hash');
	try {
		const validationResults = await validateQrlTxHash(userTxHash);
		if (validationResults.isValid) {
			const txHashResponse = await axios.post(`http://localhost:${apiPort}/v1/qrl-get-transaction`, { txHash: validationResults.hash });
			const txHashData = txHashResponse.data.data.tx;

			// Check if transaction exists or if it has confirmations
			if (!txHashData || Object.keys(txHashData).length === 0 || txHashResponse.data.data.confirmations === '0') {
				return await interaction.editReply('Transaction not found or has not been confirmed yet. Please check your info and try again.');
			}

			// Prepare the transfer details
			let transferDetails = '';
			if (txHashData.transfer && txHashData.transfer.addrs_to && txHashData.transfer.amounts) {
				txHashData.transfer.addrs_to.forEach((address, index) => {
					const amount = txHashData.transfer.amounts[index];
					transferDetails += `\n> **to:** \`${truncateHash(address)}\` **amount:** \`${shorToQuanta(amount)}\``;
				});
			}

			// Prepare message details if available
			let messageDetails = '';
			if (txHashData.message && txHashData.message.message_hash) {
				try {
					const plaintext = decodeNotarizationMessage(txHashData.message.message_hash);
					messageDetails = `\n> **message_hash:** \`${plaintext}\``;
				}
				catch (error) {
					console.error(error.message);
					messageDetails = `\n> **message_hash:** \`${truncateHash(txHashData.message.message_hash)}\``;
				}
			}

			// Prepare token details (handling both single token and multiple tokens)
			let tokenDetails = '';
			if (txHashData.token) {
				const { symbol, name, owner, decimals, initialBalances } = txHashData.token;
				tokenDetails += `\n> **Token Symbol:** \`${symbol}\``;
				tokenDetails += `\n> **Token Name:** \`${name}\``;
				tokenDetails += `\n> **Token Owner:** \`${truncateHash(owner)}\``;
				tokenDetails += `\n> **Decimals:** \`${decimals}\``;

				if (initialBalances && initialBalances.length > 0) {
					tokenDetails += '\n> **Initial Balances:**';
					initialBalances.forEach(balance => {
						tokenDetails += `\n	 - Address: \`${truncateHash(balance.address)}\`, Amount: \`${balance.amount}\``;
					});
				}
			}

			if (txHashData.tokens && Array.isArray(txHashData.tokens)) {
				txHashData.tokens.forEach((token) => {
					const { symbol, name, owner, decimals, initialBalances } = token;
					tokenDetails += `\n> **Token Symbol:** \`${symbol}\``;
					tokenDetails += `\n> **Token Name:** \`${name}\``;
					tokenDetails += `\n> **Token Owner:** \`${truncateHash(owner)}\``;
					tokenDetails += `\n> **Decimals:** \`${decimals}\``;

					if (initialBalances && initialBalances.length > 0) {
						tokenDetails += '\n> **Initial Balances:**';
						initialBalances.forEach(balance => {
							tokenDetails += `\n	 - Address: \`${truncateHash(balance.address)}\`, Amount: \`${balance.amount}\``;
						});
					}
					tokenDetails += '\n----------------------------';
				});
			}

			// Construct reply message dynamically
			let replyMessage = `Here's the QRL transaction data:\n> **master_addr:** \`${truncateHash(txHashData.master_addr)}\`
							> **fee:** \`${txHashData.fee !== undefined ? txHashData.fee : 0}\`
							> **public_key:** \`${truncateHash(txHashData.public_key)}\`
							> **signature:** \`${truncateHash(txHashData.signature)}\`
							> **nonce:** \`${txHashData.nonce}\`
							> **transaction_hash:** \`${truncateHash(txHashData.transaction_hash)}\`
							> **signer_addr:** \`${truncateHash(txHashData.signer_addr)}\`
							> **confirmations:** \`${txHashResponse.data.data.confirmations}\`
							> **block_number:** \`${txHashResponse.data.data.block_number}\`
							> **block_header_hash:** \`${truncateHash(txHashResponse.data.data.block_header_hash)}\``;

			// Add transfer details if available
			if (transferDetails) {
				replyMessage += `\n> __**Transfers**__${transferDetails}`;
			}

			// Add message details if available
			if (messageDetails) {
				replyMessage += `\n> __**Messages**__${messageDetails}`;
			}

			// Add token details if available
			if (tokenDetails) {
				replyMessage += `\n> __**Tokens**__${tokenDetails}`;
			}

			// Append the explorer link
			const url = `https://explorer.theqrl.org/tx/${txHashData.transaction_hash}`;
			const explorerLink = hideLinkEmbed(url);
			replyMessage += `\nMore info: ${explorerLink}`;

			// Public message with transfer, message, and token details included (conditionally)
			await interaction.editReply(replyMessage);
		}
		else {
			await interaction.editReply(`Invalid txHash:\t${validationResults.error}`);
		}
	}
	catch (error) {
		const errorMessage = `An error occurred during Transaction retrieval: ${error.message}`;
		console.error(errorMessage);
		return await interaction.editReply(`Looks like I'm struggling to complete that right now...\n${errorMessage}`);
	}
}

module.exports = getTransactionSub;
