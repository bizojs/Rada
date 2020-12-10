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
			this.addWarn = async (warnCase) => {
				let array = [];
				let db = this.settings.get(this.id, 'warnings', array);
				if (db.length < 1) {
					array.push(warnCase);
				} else {
					for(let i = 0; i < db.length; i++) {
						array.push(db[i]);
					}
					array.push(warnCase);
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
