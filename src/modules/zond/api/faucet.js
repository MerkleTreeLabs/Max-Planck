require('module-alias/register');

// const axios = require('axios');
const { signTransaction, TransactionFactory } = require('@theqrl/web3-zond-accounts');

const config = require('@config');
const helper = require('@helper');
const getNonce = require('@zond-api/nonceLookup');
const sendTx = require('@zond-api/sendtx');
const getChainId = require('@zond-api/chainIdLookup');
const getPendingBaseFee = require('@zond-api/pendingBaseFeeLookup');
const getGasEstimate = require('@zond-api/estimateGas');

async function sendFaucetTx(toAddress, amount) {
	try {
		const transferAmount = helper.decToHex(amount);
		const nonce = await getNonce(config.faucetAddress);
		const chainId = await getChainId();
		const pendingBaseFee = await getPendingBaseFee();
		// around 100 Shor
		const tip = 0x174876eabc;
		const txData = {
			from: config.faucetAddress,
			to: `0x${toAddress}`,
			gasLimit: 21000,
			type: '0x2',
			value: `0x${transferAmount}`,
			chainId,
			nonce,
		};
		const estimatedGas = await getGasEstimate(txData);
		txData.gas = estimatedGas;
		txData.maxPriorityFeePerGas = `0x${tip.toString(16)}`;
		txData.maxFeePerGas = `0x${(tip + parseInt(pendingBaseFee, 16) - 1).toString(16)}`;
		const transaction = TransactionFactory.fromTxData(txData);
		const signedTx = await signTransaction(transaction, `${config.faucetHexseed}`);
		return await sendTx(signedTx);
	}
	catch (error)	{
		const errorMessage = `Error occurred while sending the faucet request: ${error.message}`;
		console.error(errorMessage);
		return new Error(errorMessage);
	}
}

module.exports = sendFaucetTx;
