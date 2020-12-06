const { Structures } = require('discord.js');
const Responder = require('../structures/Responder');
const Reactor = require('../structures/Reactor');
const paginate = require('../../lib/structures/Paginate');

Structures.extend('Message', Message => {
	class RadaMessage extends Message {
		constructor(...args) {
			super(...args);
			this.responder = new Responder(this);
			this.reactor = new Reactor(this);
            this.reacter = this.reactor;
			this.paginate = async (array) => { return paginate(this, array) }
			
		}
	}
	return RadaMessage;
});
