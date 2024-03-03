function sanitizeAddress(address) {
    // Remove any characters that are not hexadecimal, except the '0x' prefix
    return address.replace(/^0x/i, '').replace(/[^0-9a-fA-F]/g, '');
}


function validateAddress(address) {
	console.log(`address given:\t${address}`)
    const zondAddressRegex = /^(0x)?[0-9a-f]{40}$/i;
    const sanitizedAddress = sanitizeAddress(address);
    console.log(`sanitizedAddress:\t${sanitizedAddress}`)
    const lowercaseAddress = sanitizedAddress.toLowerCase();
    console.log(`lowercaseAddress:\t${lowercaseAddress}`)
    if (lowercaseAddress.match(zondAddressRegex)) {
        return { isValid: true, address: lowercaseAddress };
    } else {
        return { isValid: false, error: 'Invalid address' };
    }
}

exports.validate = validateAddress;
