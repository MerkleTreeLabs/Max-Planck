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

exports.validate = validateAddress;
