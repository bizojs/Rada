const { emotes, reactions } = require('../constants');

class Responder {

	constructor(message) {
		this.message = message;
	}

	success(text) {
		if (!text) return this.message.react(reactions.success);
		return this.message.channel.send(`${emotes.success} | ${text}`);
	}

	error(text) {
		if (!text) return this.message.react(reactions.error);
		return this.message.channel.send(`${emotes.error} | ${text}`);
	}

	info(text) {
		if (!text) return this.message.react(reactions.info);
		return this.message.channel.send(`${emotes.info} | ${text}`);
	}

}

module.exports = Responder;
