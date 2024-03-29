exports.ApiError = class extends Error {
	constructor(message, status=500, addt={}) {
		super(message);
		this.status=status;
		this.json = {message, ...addt};
	}
}