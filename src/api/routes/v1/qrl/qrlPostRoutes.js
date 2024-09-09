const express = require('express');
// Import QRL API functions here
const { balance } = require('@qrl-chain/balanceLookup');


const router = express.Router();

// Define QRL endpoints here

// qrl balance
router.post('/qrl-balance', async (req, res) => {
	try {
		const address = req.body.address;

		if (!address) {
			return res.status(400).json({ success: false, error: 'Address is required' });
		}

		// Process the address and get the balance
		const currentBalance = await balance(address);

		res.status(200).json({ success: true, balance: currentBalance });
	}
	catch (error) {
		// Handle any errors
		res.status(500).json({ success: false, error: 'Failed to fetch balance' });
	}
});


module.exports = router;
