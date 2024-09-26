function ApproveListing(req) {
	if (req.metadata.scheme === 'ipc') { return 'Approve'; }
}

module.exports = ApproveListing;
