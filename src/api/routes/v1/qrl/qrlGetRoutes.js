require('module-alias/register');
const express = require('express');
// Import QRL API functions here

const { height } = require('@qrl-chain/heightLookup');

const router = express.Router();

// Define QRL endpoints here

router.get('/qrl-height', async (req, res) => {
	try {
		// fetch the current block height
		const currentBlock = await height();
		res.status(200).json({ success: true, height: currentBlock });
	}
	catch (error) {
		// Handle any errors
		console.error('Error in fetching height:', error);
		res.status(500).json({ success: false, error: 'Failed to fetch QRL height' });
	}
});


module.exports = router;
