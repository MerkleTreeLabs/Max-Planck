function sanitizeAddress(address) {
    // Remove any characters that are not hexadecimal
    return address.replace(/[^0-9a-fA-F]/g, '');
}

function validateAddress(address) {
    const zondAddressRegex = /^(0x)?[0-9a-f]{40}$/i;
    const sanitizedAddress = sanitizeAddress(address);
    const lowercaseAddress = sanitizedAddress.toLowerCase();
    if (lowercaseAddress.match(zondAddressRegex)) {
        return { isValid: true, address: lowercaseAddress };
    } else {
        return { isValid: false, error: 'Invalid address' };
    }
}

exports.validate = validateAddress;
