require('module-alias/register');
const express = require('express');
const { swaggerInterface, apiInterface, apiPort, swaggerPort, enableSwagger } = require('@config');
const zondGetRoutesV1 = require('@zond-v1-routes/zondGetRoutes');
const zondPostRoutesV1 = require('@zond-v1-routes/zondPostRoutes');
const qrlGetRoutesV1 = require('@qrl-v1-routes/qrlGetRoutes');
const qrlPostRoutesV1 = require('@qrl-v1-routes/qrlPostRoutes');
// const zondRoutesV2 = require('./routes/v2/zond/zondRoutesV2');
// const qrlRoutesV2 = require('./routes/v2/qrl/qrlRoutesV2');

// Import swaggerUi and specs
const { swaggerUi, specs } = require('@swaggerConfig');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

const cors = require('cors');
app.use(cors({
	// Or specify specific origins if needed, e.g., 'http://localhost:8080'
	origin: '*',
}));


// V1 GET Routes
app.use('/v1', zondGetRoutesV1);
app.use('/v1', qrlGetRoutesV1);

// V1 POST Routes
app.use('/v1', zondPostRoutesV1);
app.use('/v1', qrlPostRoutesV1);

// Conditionally start Swagger UI based on enableSwagger value
if (enableSwagger) {
	app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

	// Start Swagger UI
	app.listen(swaggerPort, swaggerInterface, () => {
		console.log(`Swagger UI is running on ${swaggerInterface}:${swaggerPort}`);
	});
}

// Start the server
app.listen(apiPort, apiInterface, () => {
	console.log(`Server is running on ${apiInterface}:${apiPort}`);
});
