const { Structures } = require('discord.js');
const Responder = require('../structures/Responder');
const Reactor = require('../structures/Reactor');
const Paginator = require('../classes/Paginator');

Structures.extend('Message', Message => {
	class RadaMessage extends Message {
		constructor(...args) {
			super(...args);
			this.responder = new Responder(this);
			this.reactor = new Reactor(this);
            this.reacter = this.reactor;
			this.pagination = new Paginator(this);
		}
		paginate = async (array) => {
			return this.pagination.paginate(array);
		}
	}
	return RadaMessage;
});
