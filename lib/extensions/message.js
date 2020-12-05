const { Structures } = require('discord.js');
const Responder = require('../structures/Responder');
const Reacter = require('../structures/Reacter');
const paginate = require('../../lib/structures/Paginate');

Structures.extend('Message', Message => {
	class RadaMessage extends Message {
		constructor(...args) {
			super(...args);
			this.responder = new Responder(this);
			this.reactor = new Reacter(this);
                        this.reacter = this.reactor;
			this.send = async (message) => { return this.channel.send(message) }
			this.paginate = async (array) => { return paginate(this, array) }
			
		}
	}
	return RadaMessage;
});
