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
			this.punishments = {
				'punishments.kick': 'Kicked',
				'punishments.ban': 'Banned',
				'punishments.mute': 'Muted',
				'punishments.warn': 'Warned'
			}
			this.settings.updateInfraction = async (setting, moderator, reason) => {
				let array = [];
				let db = this.settings.get(this.id, setting, array);
				let infraction = `${this.punishments[setting]} by __${moderator.tag}__ for **${reason}**`;
				if (db.length < 1) {
					array.push(infraction);
				} else {
					for(let i = 0; i < db.length; i++) {
						array.push(db[i]);
					}
					array.push(infraction);
				}
				await this.settings.set(this.id, setting, array);
			}
			this.settings.clearInfractions = () => {
				let infractions = ['punishments.kick', 'punishments.ban', 'punishments.mute','punishments.warn']
				for (let i = 0; i < infractions.length; i++) {
					this.settings.reset(infractions[i]);
					return true;
				}
			}
		}
	}
	return RadaMember;
});