
Below is a list of the requirements to run the bot on hardware (virtual or other)


> [!DANGER] THIS IS ONLY A TESTING SERVER
> Additional hardware requirements will be needed for the mainnet version.
> 
> Further information is needed to confirm the final requirements




## Minimum Hardware Requirements

- **Server**: 
	- 8Gb RAM
	- 4CPU core
	- 180Gb NVMe (*OS and internal storage*)
	- 80Gb NVMe (*Zond*)
	- 120Gb HDD (*QRL*)

Due to the large size of the Zond node running in [Archive mode](https://ethereum.org/en/developers/docs/nodes-and-clients/archive-nodes/) there are some serious needs for the hardware. There are large RAM and CPU tasks as well as additional Drive space required. 

The archive node will store all data from each transaction, block and validation that has happened from genesis.

Additional tasks on the server will come from the QRL node generating addresses and signing transactions into the network for users.


