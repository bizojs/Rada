const { Structures } = require('discord.js');
const Responder = require('../structures/Responder');
const Reacter = require('../structures/Reacter');
const paginate = require('../../lib/structures/Paginate');

Structures.extend('Message', Message => {
	class RadaMessage extends Message {
		constructor(...args) {
			super(...args);
			this.responder = new Responder(this);
			this.reacter = new Reacter(this);
		}
		async paginate(embeds) {
			paginate(this, embeds)
		}
	}
	return RadaMessage;
});