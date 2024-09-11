const BigNumber = require('bignumber.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const config = require('@config');

const userFile = path.resolve(__dirname, '../userlog.json');

function validateZondAddress(address) {
	try {
		const zondAddressRegex = /^(0x)?[0-9a-f]{40}$/i;
		if (zondAddressRegex.test(address)) {
			// strip prefix
			const withoutPrefix = address.startsWith('0x') ? address.slice(2) : address;
			// sanitize the info
			const sanitizedAddress = withoutPrefix.replace(/[^0-9a-fA-F]/g, '');
			const lowercaseAddress = sanitizedAddress.toLowerCase();
			return { isValid: true, address: lowercaseAddress };
		}
		else {
			return { isValid: false, error: 'Invalid address' };
		}
	}
	catch (error) {
		const errorMessage = `Error occurred while validating this address: ${error.message}`;
		console.log(errorMessage);
		return { isValid: false, error: `Error validating given address: ${errorMessage}` };
	}
}


async function validateQRLAddress(address) {
/*
	 // test the address to the regex pattern``
		function isQRLAddress(addy) {
			let test = false;
			if(/^(Q|q)[0-9a-fA-f]{78}$/.test(addy)) {
				test = true;
			}
			return test;
		}
*/

	try {
		const qrlAddressRegex = /^(Q|q)[0-9a-fA-f]{78}$/i;
		if (qrlAddressRegex.test(address)) {
			// strip prefix
			const withoutPrefix = address.startsWith('Q') ? address.slice(1) : address;
			// sanitize the info
			const sanitizedAddress = withoutPrefix.replace(/[^0-9a-fA-F]/g, '');
			const lowercaseAddress = sanitizedAddress.toLowerCase();

			const isValidAddress = await axios.post(`http://localhost:${config.apiPort}/v1/qrl-is-valid-address`, { address: `Q${lowercaseAddress}` });
			if (isValidAddress.data.data.valid) {
				// the sanitized address passed the validation check
				console.log(`is-valid-address: ${JSON.stringify(isValidAddress.data)}`);
				return { isValid: true, address: lowercaseAddress };
			}
			else {
				return { isValid: false, error: 'Invalid address' };
			}
		}
		else {
			return { isValid: false, error: 'qrlAddressRegex error' };
		}
	}
	catch (error) {
		const errorMessage = `Error occurred while validating this address: ${error.message}`;
		console.log(errorMessage);
		return { isValid: false, error: `Error validating given address: ${errorMessage}` };
	}
}


function validateTxHash(hash) {
	try {
		const zondTxHashRegex = /^(0x)?[0-9a-f]{64}$/i;

		if (zondTxHashRegex.test(hash)) {
			const withoutPrefix = hash.startsWith('0x') ? hash.slice(2) : hash;
			const lowercaseTxHash = withoutPrefix.toLowerCase();

			return { isValid: true, hash: lowercaseTxHash };
		}
		else {
			return { isValid: false, error: 'Invalid TX Hash: Must be a 64-character hexadecimal string with optional "0x" prefix.' };
		}
	}
	catch (error) {
		console.error('Error occurred during validation:', error);
		return { isValid: false, error: 'Error validating TX Hash' };
	}
}


function validateQrlTxHash(hash) {
	try {
		// Correct regex to validate that the entire string is a 64-character hexadecimal
		const qrlTxHashRegex = /^[a-fA-F0-9]{64}$/;

		if (qrlTxHashRegex.test(hash)) {
			// Convert the hash to lowercase and return the valid result
			const lowercaseTxHash = hash.toLowerCase();
			return { isValid: true, hash: lowercaseTxHash };
		}
		else {
			return { isValid: false, error: 'Invalid TX Hash: Must be 64 hexadecimal characters.' };
		}
	}
	catch (error) {
		console.error('Error occurred during validation:', error);
		return { isValid: false, error: 'Error validating TX Hash' };
	}
}


function hexToDec(value) {
	try {
		const hexNumber = new BigNumber(value, 16);
		return hexNumber.toFixed();
	}
	catch (error) {
		console.error('Error occurred during conversion:', error);
		return null;
	}
}

function decToHex(value) {
	try {
		const bigNumber = new BigNumber(value);

		// Convert the decimal number to hexadecimal
		const hexNumber = bigNumber.toString(16);

		return hexNumber;
	}
	catch (error) {
		console.error('Error occurred during conversion:', error);
		return null;
	}
}


function quantaToShor(number) {
	try {
		const bigNumber = new BigNumber(number);
		const multiplied = bigNumber.multipliedBy('1e9');
		const resultString = multiplied.toFixed(0);
		const result = resultString.replace('.', '');
		return result;
	}
	catch (error) {
		console.error('Error occurred during conversion:', error);
		return null;
	}
}


function shorToQuanta(number) {
	try {
		const bigNumber = new BigNumber(number);
		const divided = bigNumber.dividedBy('1e9');
		const result = divided.toFixed();
		return result;
	}
	catch (error) {
		console.error('Error occurred during conversion:', error);
		return null;
	}
}


function qToPlanck(number) {
	try {
		const bigNumber = new BigNumber(number);
		const multiplied = bigNumber.multipliedBy('1e18');
		const resultString = multiplied.toFixed(0);
		const result = resultString.replace('.', '');
		return result;
	}
	catch (error) {
		console.error('Error occurred during conversion:', error);
		return null;
	}
}


function planckToQ(number) {
	try {
		const bigNumber = new BigNumber(number);
		const divided = bigNumber.dividedBy('1e18');
		const result = divided.toFixed();
		return result;
	}
	catch (error) {
		console.error('Error occurred during conversion:', error);
		return null;
	}
}


function writeUserData(newData) {
	console.log(`newData: ${JSON.stringify(newData)}`);
	try {
		// Read the userlog.json file
		if (!fs.existsSync(userFile)) {
			throw new Error(`File not found: ${userFile}`);
		}

		const userData = fs.readFileSync(userFile);
		const parsedData = JSON.parse(userData);

		// Ensure users array exists, otherwise initialize it
		if (!Array.isArray(parsedData.users)) {
			parsedData.users = [];
		}

		// Append new user data
		parsedData.users.push(newData);

		// Write the updated data back to the file
		fs.writeFileSync(userFile, JSON.stringify(parsedData, null, 2));

		return 'Success';
	}
	catch (error) {
		console.error('Error occurred during file operation:', error);
		return 'Fail';
	}
}

function truncateHash(hash, startLength = 8, endLength = 8) {
	// Ensure hash is a valid string and long enough to truncate
	if (typeof hash === 'string' && hash.length > startLength + endLength) {
		const start = hash.substring(0, startLength);
		const end = hash.substring(hash.length - endLength);
		return `${start}...${end}`;
	}
	else if (typeof hash === 'string') {
		// If the string is too short, return it as is
		return hash;
	}
	else {
		// If hash is undefined or not a string, return an empty string or handle it gracefully
		return '0';
	}
}


function decodeNotarizationMessage(hexMessage) {
	const notarizationPrefix = 'afafa';
	console.log(`hexMessage: ${hexMessage}`);

	// Verify that the message starts with the notarization prefix
	if (!hexMessage.startsWith(notarizationPrefix)) {
		throw new Error('The provided message is not a notarization message.');
	}

	// Strip the notarization prefix
	const encodedMessage = hexMessage.slice(notarizationPrefix.length);
	console.log(`encodedMessage: ${encodedMessage}`);

	// Find where the actual URL/message begins in hex format
	const urlStartIndex = encodedMessage.indexOf('687474');

	if (urlStartIndex === -1) {
		throw new Error('No valid URL or plaintext found in the message.');
	}

	// Extract the part starting from the URL
	const messageToDecode = encodedMessage.slice(urlStartIndex);
	console.log(`messageToDecode: ${messageToDecode}`);

	// Function to convert hex to ASCII
	function hexToAscii(hex) {
		let str = '';
		for (let i = 0; i < hex.length; i += 2) {
			const hexChar = hex.slice(i, i + 2);
			const charCode = parseInt(hexChar, 16);
			str += String.fromCharCode(charCode);
		}
		return str;
	}

	// Decode only the readable part (starting from the URL in this case)
	const decodedMessage = hexToAscii(messageToDecode);

	console.log(`Decoded message: ${decodedMessage}`);
	return decodedMessage;
}

exports.decToHex = decToHex;
exports.writeUserData = writeUserData;
exports.shorToQuanta = shorToQuanta;
exports.quantaToShor = quantaToShor;
exports.qToPlanck = qToPlanck;
exports.planckToQ = planckToQ;
exports.validateZondAddress = validateZondAddress;
exports.validateQRLAddress = validateQRLAddress;
exports.validateTxHash = validateTxHash;
exports.validateQrlTxHash = validateQrlTxHash;
exports.hexToDec = hexToDec;
exports.truncateHash = truncateHash;
exports.decodeNotarizationMessage = decodeNotarizationMessage;
