const { Structures } = require('discord.js');
const Responder = require('../structures/Responder');
const Reacter = require('../structures/Reacter');
const RichDisplay = require('../structures/RichDisplay');

Structures.extend('Message', Message => {
	class RadaMessage extends Message {
		constructor(...args) {
			super(...args);
			this.responder = new Responder(this);
			this.reacter = new Reacter(this);
		}
		async paginate(pages, title) {
			const display = new RichDisplay(this.client.util.embed()
				.setColor(this.client.color)
				.setThumbnail(this.client.avatar)
				.setTimestamp()
        	);
			for (let i = 0; i < pages.length; i++) {
				display
				.addPage(template => template
					.setDescription(pages[i])
				);
			}
			return display.run(await this.channel.send(title), { filter: (reaction, user) => user === this.author });
		}
	}
	return RadaMessage;
});