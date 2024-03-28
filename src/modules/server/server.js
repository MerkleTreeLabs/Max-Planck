const express = require('express');
// const axios = require('axios');
const app = express();
const { apiPort } = require('../../config.json');

const PORT = apiPort || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to handle GET request to /block
app.get('/block', async (req, res) => {
	try {
		// fetch the current block
		const { block } = require('../zond/api/blockLookup');
		const curentBlock = await block();
		res.json({ currentBlock: curentBlock });
	}
	catch (error) {
		// Handle any errors
		res.status(500).json({ error: 'Failed to fetch time' });
	}
});

// Endpoint to handle GET request to /balance
app.get('/balance', (req, res) => {
	try {
		const address = req.query.address;

		if (!address) {
			return res.status(400).json({ error: 'Address is required' });
		}

		// Process the address and denomination
		const { balance } = require('../zond/api/balanceLookup');
		const curentBalance = balance(address);
		res.json({ balance: curentBalance });
	}
	catch (error) {
		// Handle any errors
		res.status(500).json({ error: 'Failed to process balance' });
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
