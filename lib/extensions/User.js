const { Structures } = require('discord.js');
const model = require('../../src/models/userSchema');
const { MongooseProvider } = require('discord-akairo');
const { badges } = require('../constants');

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
			this.displayFlags = () => {
				let badgeArray = [];
				try { this.flags.toArray().filter(badge => badge !== "VERIFIED_DEVELOPER"); } catch (e) { return []; }
				let flags = this.flags.toArray().filter(badge => badge !== "VERIFIED_DEVELOPER");
				for (const flag of flags) {
					badgeArray.push(badges[flag])
				}
				if (this.avatarURL({dynamic: true}).replace('webm', 'gif').endsWith('.gif')) badgeArray.push(badges['NITRO']);
				return badgeArray.join(' ');
			}
		}
	}
	return RadaUser;
});