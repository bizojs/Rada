const { Structures } = require('discord.js');
const model = require('../../src/models/userSchema');
const { MongooseProvider } = require('discord-akairo');

Structures.extend('User', User => {
	class RadaUser extends User {
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
	return RadaUser;
});