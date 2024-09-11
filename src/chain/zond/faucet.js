require('module-alias/register');

const config = require('@config');
const helper = require('@helper');
const getNonce = require('@zond-chain/nonceLookup');
const getChainId = require('@zond-chain/chainIdLookup');
const getPendingBaseFee = require('@zond-chain/pendingBaseFeeLookup');

const Web3 = require('@theqrl/web3').default;
const web3 = new Web3(`http://${config.zondPubAPI}`);

// Global BigInt to JSON serializer
// eslint-disable-next-line
BigInt.prototype.toJSON = function() {
	return this.toString();
};

async function faucet(toAddress, amount) {
	try {
		const isConnected = await web3.zond.net.isListening();
		if (!isConnected) {
			throw new Error('Web3 is not connected to the node.');
		}
		console.log('Web3 connected to the node.');

		const transferAmount = helper.decToHex(amount);
		const nonce = await getNonce(config.faucetAddress);
		const chainId = await getChainId();
		const pendingBaseFee = await getPendingBaseFee();

		if (!pendingBaseFee) {
			throw new Error('Pending base fee is undefined.');
		}

		const tip = 0x174876eabc;
		const maxFeePerGas = `0x${(tip + parseInt(pendingBaseFee, 16) - 1).toString(16)}`;
		const maxPriorityFeePerGas = `0x${tip.toString(16)}`;

		const txData = {
			from: config.faucetAddress,
			to: `0x${toAddress}`,
			gasLimit: '0x' + parseInt(21000).toString(16),
			type: '0x2',
			value: `0x${transferAmount}`,
			chainId: '0x' + parseInt(chainId).toString(16),
			nonce: '0x' + parseInt(nonce).toString(16),
			maxFeePerGas,
			maxPriorityFeePerGas,
			data: '0x',
		};

		const receipt = await web3.zond.sendTransaction(txData);
		console.log('Transaction Receipt:', JSON.stringify(receipt, null, 2));

		return receipt;
	}
	catch (error) {
		const errorMessage = `Error occurred while sending the faucet request: ${error.message}`;
		console.error(errorMessage);
		return new Error(errorMessage);
	}
}

module.exports = { faucet };
