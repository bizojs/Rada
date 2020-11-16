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
		async paginate(embeds, timeout) {
			const paginator = new Pagination();
	        paginator.setClient(this.client);
	        paginator.setMaxItemsPerPage(1);
	        paginator.setEmbeds(embeds);
	        paginator.setTTL(timeout);
	        paginator.on('start', async() => {
	            await paginator.message.react('742375771913453628');
	            await paginator.message.react('🗑');
	            await paginator.message.react('742375779656269914');
	        })
	        paginator.on('end', async() => {
	            await paginator.message.reactions.removeAll();
	        })
	        paginator.on('react', async (reaction, user) => {
	            if (reaction.id == "742375779656269914") {
	                paginator.turn(1);
	                paginator.update();
	            }
	            if (reaction.id == "742375771913453628") {
	                paginator.turn(-1);
	                paginator.update();
	            }
	            if (reaction.name === "🗑") {
	            	await paginator.message.reactions.removeAll();
	            }

	        })
	        await paginator.build(this)
		}
	}
	return RadaMessage;
});