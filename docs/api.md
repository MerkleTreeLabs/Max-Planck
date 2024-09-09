# API Documentation


This doc covers the API and swagger server running for the Zond Bot

These API's are intended to seperate the node function from the client and allow multiple requests to be initated without server hangup.

Some of the functions of the process can be labor intensive, or take some time to respond back to the client. This API serves to address this.


## API Information

The API is managed using `express`. 


## Documentation 

Swagger is used for documentation and testing. This is handeled directily in the code file and can be found at the swagger port on the localhost.

> The settings need to be adjusted to expose these to an outside connection and security implications need to be taken into account.

### API Routes

There are various routes definedd under the `/src/api/routes/` directory following express api documentatin