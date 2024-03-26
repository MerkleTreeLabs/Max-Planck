const BigNumber = require('bignumber.js');
const fs = require('fs');
const path = require('path');

const userFile = path.resolve(__dirname, '../userlog.json');

function validateAddress(address) {
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
		const errorMessage = `Error occurred while fetching the latest block: ${error.message}`;
		console.log(errorMessage);
		return { isValid: false, error: `Error validating given address: ${errorMessage}` };
	}
}

function validateTxHash(hash) {
	try {
		const zondTxHashRegex = /^(0x)?[0-9a-f]{64}$/i;

		if (hash.match(zondTxHashRegex)) {
			const withoutPrefix = hash.startsWith('0x') ? hash.slice(2) : hash;
			const sanitizedTxHash = withoutPrefix.replace(/[^0-9a-fA-F]/g, '');
			const lowercaseTxHash = sanitizedTxHash.toLowerCase();

			return { isValid: true, hash: lowercaseTxHash };
		}
		else {
			return { isValid: false, error: 'Invalid TX Hash' };
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


function shorToQuanta(number) {
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


function formatTime(milliseconds) {
	// Convert milliseconds to seconds
	const totalSeconds = Math.floor(milliseconds / 1000);

	// Calculate hours, minutes, and seconds
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	// Build the formatted time string
	let formattedTime = '';
	if (hours > 0) {
		formattedTime += `${hours} hour${hours > 1 ? 's' : ''} `;
	}
	if (minutes > 0 || hours > 0) {
		formattedTime += `${minutes} min `;
	}
	formattedTime += `${seconds} sec${seconds !== 1 ? 's' : ''}`;

	return formattedTime;
}

function writeUserData(newData) {
	try {
		// Read the userlog.json file
		if (!fs.existsSync(userFile)) {
			throw new Error(`File not found: ${userFile}`);
		}
		const userData = fs.readFileSync(userFile);
		const parsedData = JSON.parse(userData);
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

exports.decToHex = decToHex;
exports.writeUserData = writeUserData;
exports.formatTime = formatTime;
exports.shorToQuanta = shorToQuanta;
exports.quantaToShor = quantaToShor;
exports.validateAddress = validateAddress;
exports.validateTxHash = validateTxHash;
exports.hexToDec = hexToDec;
