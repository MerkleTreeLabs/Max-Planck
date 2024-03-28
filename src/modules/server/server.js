require('module-alias/register');
const express = require('express');
const { apiPort } = require('@config');
const zondGetRoutesV1 = require('@zond-v1-routes/zondGetRoutes');
const zondPostRoutesV1 = require('@zond-v1-routes/zondPostRoutes');
// const qrlRoutesV1 = require('./routes/v1/qrl/qrlRoutes');
// const zondRoutesV2 = require('./routes/v2/zond/zondRoutesV2');
// const qrlRoutesV2 = require('./routes/v2/qrl/qrlRoutesV2');

// Import swaggerUi and specs
const { swaggerUi, specs } = require('@swaggerConfig');
const SWAGGER_PORT = 4000;

const app = express();
const PORT = apiPort || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// V1 GET Routes
app.use('/v1', zondGetRoutesV1);
// app.use('/v1', qrlRoutesV1);


// V1 POST Routes
app.use('/v1', zondPostRoutesV1);

// Swagger UI setup
app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// V2 Routes for future releases
// app.use('/v2', zondRoutesV2);
// app.use('/v2', qrlRoutesV2);

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

// Start Swagger UI
app.listen(SWAGGER_PORT, () => {
	console.log(`Swagger UI is running on port ${SWAGGER_PORT}`);
});
