const { Structures } = require('discord.js');
const model = require('../../src/models/guildSchema');
const { MongooseProvider } = require('discord-akairo');

Structures.extend('Guild', Guild => {
	class RadaGuild extends Guild {
		constructor(...args) {
			super(...args);
            this.settings = new MongooseProvider(model);
			this.settings.init();
			this.settings.reset = (setting) => {
				this.settings.clear(this, setting);
				return true;
			}
		}
	}
	return RadaGuild;
});