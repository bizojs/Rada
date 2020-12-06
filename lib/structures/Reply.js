const { emotes } = require('../constants');

class Reply {

	constructor(message) {
		this.message = message;
	}

        default(text) {
            if (!text) return undefined;
            return this.message.reply(text);
        }

	success(text) {
		if (!text) return this.message.reacter.success();
		return this.message.reply(`${emotes.success} | ${text}`);
	}

	error(text) {
		if (!text) return this.message.reacter.error();
		return this.message.reply(`${emotes.error} | ${text}`);
	}

	info(text) {
		if (!text) return this.message.reacter.info();
		return this.message.reply(`${emotes.info} | ${text}`);
	}

}

module.exports = Reply;
