const { Structures } = require('discord.js');
const Responder = require('../structures/Responder');
const Reacter = require('../structures/Reacter');
const { Pagination } = require('../structures/Paginate');

Structures.extend('Message', Message => {
	class RadaMessage extends Message {
		constructor(...args) {
			super(...args);
			this.responder = new Responder(this);
			this.reacter = new Reacter(this)
		}
	}
	return RadaMessage;
});
