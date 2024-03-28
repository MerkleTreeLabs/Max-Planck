const express = require('express');
const { apiPort } = require('../../config.json');
const { block } = require('../zond/api/blockLookup');
const { balance } = require('../zond/api/balanceLookup');

const app = express();
const PORT = apiPort || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to handle GET request to /zond-block
app.get('/zond-block', async (req, res) => {
	try {
		// fetch the current block
		const currentBlock = await block();
		res.json({ currentBlock });
	}
	catch (error) {
		// Handle any errors
		res.status(500).json({ error: 'Failed to fetch block' });
	}
});

// Endpoint to handle GET request to /zond-balance
app.get('/zond-balance', async (req, res) => {
	try {
		const address = req.query.address;

		if (!address) {
			return res.status(400).json({ error: 'Address is required' });
		}

		// Process the address and get the balance
		const currentBalance = await balance(address);
		res.json({ balance: currentBalance });
	}
	catch (error) {
		// Handle any errors
		res.status(500).json({ error: 'Failed to fetch balance' });
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
