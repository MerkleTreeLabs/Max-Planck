function sanitizeAddress(address) {
	// Remove the '0x' prefix if it exists
	const withoutPrefix = address.startsWith('0x') ? address.slice(2) : address;
	// Remove any characters that are not hexadecimal
	const sanitized = withoutPrefix.replace(/[^0-9a-fA-F]/g, '');
	// Add back the '0x' prefix if it was originally there
	return (address.startsWith('0x') ? '0x' : '') + sanitized;
}

function validateAddress(address) {
	console.log(`address given:\t${address}`);
	const zondAddressRegex = /^(0x)?[0-9a-f]{40}$/i;
	const sanitizedAddress = sanitizeAddress(address);
	console.log(`sanitizedAddress:\t${sanitizedAddress}`);
	const lowercaseAddress = sanitizedAddress.toLowerCase();
	console.log(`lowercaseAddress:\t${lowercaseAddress}`);
	if (lowercaseAddress.match(zondAddressRegex)) {
		return { isValid: true, address: lowercaseAddress };
	}
	else {
		return { isValid: false, error: 'Invalid address' };
	}
}

exports.validate = validateAddress;
