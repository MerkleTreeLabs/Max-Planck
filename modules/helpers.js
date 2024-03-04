const BigNumber = require('bignumber.js');
const fs = require('fs');
const path = require('path');

const userFile = path.resolve(__dirname, '../userlog.json');


function sanitizeAddress(address) {
	try {
		const withoutPrefix = address.startsWith('0x') ? address.slice(2) : address;
		const sanitized = withoutPrefix.replace(/[^0-9a-fA-F]/g, '');
		return (address.startsWith('0x') ? '0x' : '') + sanitized;
	}
	catch (error) {
		console.error('Error occurred during address sanitization:', error);
		return null;
	}
}

function validateAddress(address) {
	try {
		const zondAddressRegex = /^(0x)?[0-9a-f]{40}$/i;
		const sanitizedAddress = sanitizeAddress(address);
		const lowercaseAddress = sanitizedAddress.toLowerCase();
		console.log(`validateAddress:\t${lowercaseAddress}`);
		if (lowercaseAddress.match(zondAddressRegex)) {
			return { isValid: true, address: lowercaseAddress };
		}
		else {
			return { isValid: false, error: 'Invalid address' };
		}
	}
	catch (error) {
		console.error('Error occurred during validation:', error);
		return { isValid: false, error: 'Error validating given address' };
	}
}

function validateTxHash(hash) {
	try {
		const zondTxHashRegex = /^(0x)?[0-9a-f]{64}$/i;
		const sanitizedTxHash = sanitizeAddress(hash);
		const lowercaseTxHash = sanitizedTxHash.toLowerCase();
		if (lowercaseTxHash.match(zondTxHashRegex)) {
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

function hexToDec(value, denomination) {
	try {
		const hexNumber = new BigNumber(value, 16);
		if (!['quanta', 'wei'].includes(denomination)) {
			throw new Error('Invalid denomination. Please provide "quanta" or "wei".');
		}
		// this is working but not easy to understand
		// return denomination === 'quanta' ? hexNumber.dividedBy('1e18').toFixed() : hexNumber.toFixed();
		if (denomination === 'quanta') {
			return hexNumber.dividedBy('1e18').toFixed();
		}
		else {
			return hexNumber.toFixed();
		}
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
		console.log(`quanta value:\t${bigNumber}\nquantaToShor:\t${result}`);
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


function userLookup(userInfo) {
	console.log(`userLookup:\t${JSON.stringify(userInfo)}`)
	try {
		// read and parse the userlog.json file
		const userData = fs.readFileSync(userFile);
		const parsedData = JSON.parse(userData);
		console.log(`parsedData:\t ${JSON.stringify(parsedData)}`)
		// Find user information by discord_id.
		const foundUserIndex = parsedData.users.findIndex(user => user.discordId === String(userInfo.discordId));
		console.log(`foundUserIndex:\t ${foundUserIndex}`)
		if (foundUserIndex !== -1) {
		console.log(`FOUND!\nData: \t ${JSON.parse(parsedData.users[foundUserIndex])}`)
			// user is found
			return { isFound: true, data: parsedData.users[foundUserIndex] };
		}
		else {
			console.log('NOT FOUND!')
			// not found, return error
			return { isFound: false, error: 'User not found' };
		}
	}
	catch (error) {
		// handle errors
		return { isFound: false, error: error.message };
	}
}


function formatTime(milliseconds) {
	console.log('formatTime')
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
	formattedTime += `${seconds} sec{seconds !== 1 ? 's' : ''}`;

	return formattedTime;
}


function writeUserData(newData) {
	console.log('writeUserData')	
	try {
		// Read the userlog.json file
        if (!fs.existsSync(userFile)) {
	        throw new Error(`File not found: ${filePath}`);
        }
		const userData = fs.readFileSync(userFile);
		const parsedData = JSON.parse(userData);

		// Find user information by discord_id
		const userIndex = parsedData.users.findIndex(user => user.discordId === newData.discordId);

		if (userIndex !== -1) {
			// Update existing user data
			parsedData.users[userIndex] = newData;
		}
		else {
			// Append new user data
			parsedData.users.push(newData);
		}

		// Write the updated data back to the file
		fs.writeFileSync(userFile, JSON.stringify(parsedData, null, 2));

		return 'Success';
	}
	catch (error) {
		console.error('Error occurred during file operation:', error);
		return 'Fail';
	}
}

exports.writeUserData = writeUserData;
exports.formatTime = formatTime;
exports.userLookup = userLookup;
exports.shorToQuanta = shorToQuanta;
exports.quantaToShor = quantaToShor;
exports.validateAddress = validateAddress;
exports.validateTxHash = validateTxHash;
exports.hexToDec = hexToDec;
