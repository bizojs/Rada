const { emotes } = require('../constants');

class Responder {

	constructor(message) {
		this.message = message;
	}

	success = (text) => {
		if (!text) return this.message.reacter.success();
		return this.message.util.send(`${emotes.success} | ${text}`);
	}

	error = (text) => {
		if (!text) return this.message.reacter.error();
		return this.message.util.send(`${emotes.error} | ${text}`);
	}

	info = (text) => {
		if (!text) return this.message.reacter.info();
		return this.message.util.send(`${emotes.info} | ${text}`);
	}

}

module.exports = Responder;
