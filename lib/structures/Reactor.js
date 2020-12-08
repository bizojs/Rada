const { reactions } = require('../constants');
module.exports = class MessageReactor {

	constructor(message) {
		this.message = message;
	}

	success = () => {
		return this.message.react(reactions.success);
	}

	error = () => {
		return this.message.react(reactions.error);
	}

	info = () => {
		return this.message.react(reactions.info)
	}

};
