# API Documentation


This doc covers the API server running for the Zond Bot

These API's are intended to seperate the node function from the client and allow multiple requests to be initated without server hangup.

Some of the functions of the process can be labor intensive, or take some time to respond back to the client. This API serves to address this.


## API Information

The API is managed using `express`. 


## Documentation 

Swagger is used for documentation and testing. This is handeled directily in the code file and can be found at the swagger port on the localhost.

> The settings need to be adjusted to expose these to an outside connection and security implications need to be taken into account.

See the [Zond-bot Swagger Docs](./swagger.md) for more info on how to write and structure the swagger docs for this project.


### API Routes

There are various routes defined under the `/src/api/routes/` directory following express api documentation

We have seperated the current API into a v1 in preperation that it may change. In side of v1 is a `qrl` and `zond` directory for each chain's API route function definitions.

These are broken into GET and POST routes. Example below.

```js
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
```

Each of these files is imported into the server and all routes enabled.

These routes call a script that is defined in the ./src/api/chain/* directories for now. These are seperated by chain and later there will be additional functions for things like DB lookups and such.

### API Route Function Files

These files define what the API does, and what it returns. The meat of the stew as it were.


here is an example, using the QRL GetHeight function

```js
require('module-alias/register');

const axios = require('axios');
const config = require('@config');

async function height() {
	try {
		const response = await axios.get(`http://${config.qrlPubAPI}/api/GetHeight`, {
			jsonrpc: '2.0',
			params: [],
		}, {
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return response.data;
	}
	catch (error)	{
		const errorMessage = `Error occurred while fetching the QRL latest height: ${error.message}`;
		console.error(errorMessage);
		return new Error(errorMessage);
	}
}

module.exports = { height };
```


This actually calls out to the QRL node and gets the height of the chain. With a valid response it returns the data to the axios server, then in return to the client that called it. Meanwhile the cilent has recieved a comment that the command is running, and the bot responds with thinking bubbles...

Once the API returns the data the bot updates and responds with the data. Meanwhile it is ready for other API calls and commands.