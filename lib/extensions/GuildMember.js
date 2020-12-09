const { Structures } = require('discord.js');
const model = require('../../src/models/memberSchema');
const { MongooseProvider } = require('discord-akairo');

Structures.extend('GuildMember', Member => {
	class RadaMember extends Member {
		constructor(...args) {
			super(...args);
            this.settings = new MongooseProvider(model);
			this.settings.init();
			this.settings.reset = (setting) => {
				this.settings.clear(this.id, setting);
				return true;
			}
			this.addWarn = async (moderator, reason) => {
				let array = [];
				let db = this.settings.get(this.id, 'warnings', array);
				let infraction = `Warned by __${moderator.tag}__ for **${db.length > 0 && db.includes(reason) ? reason + ' #2' : reason}**`;
				if (db.length < 1) {
					array.push(infraction);
				} else {
					for(let i = 0; i < db.length; i++) {
						array.push(db[i]);
					}
					array.push(infraction);
				}
				await this.settings.set(this.id, 'warnings', array);
			}
			this.clearWarns = () => {
				this.settings.reset(this.id, 'warnings');
				return true;
			}
		}
	}
	return RadaMember;
});
