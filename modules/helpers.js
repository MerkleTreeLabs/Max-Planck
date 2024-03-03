const BigNumber = require('bignumber.js');


function sanitizeAddress(address) {
	const withoutPrefix = address.startsWith('0x') ? address.slice(2) : address;
	const sanitized = withoutPrefix.replace(/[^0-9a-fA-F]/g, '');
	return (address.startsWith('0x') ? '0x' : '') + sanitized;
}

function validateAddress(address) {
	const zondAddressRegex = /^(0x)?[0-9a-f]{40}$/i;
	const sanitizedAddress = sanitizeAddress(address);
	const lowercaseAddress = sanitizedAddress.toLowerCase();
	if (lowercaseAddress.match(zondAddressRegex)) {
		return { isValid: true, address: lowercaseAddress };
	}
	else {
		return { isValid: false, error: 'Invalid address' };
	}
}

function hexToDec(value, denomination) {
	const hexNumber = new BigNumber(value, 16);
	if (!['quanta', 'wei'].includes(denomination)) {
		throw new Error('Invalid denomination. Please provide "quanta" or "wei".');
	}
	return denomination === 'quanta' ? hexNumber.dividedBy('1e18').toFixed() : hexNumber.toFixed();
}


exports.validate = validateAddress;
exports.hexToDec = hexToDec;
