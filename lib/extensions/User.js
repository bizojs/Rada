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
            this.settings.delete = (setting) => {
                this.settings.delete(this.id, setting);
                return true;
            }
            this.reminders = {
              current: [],
              old: []
            };
            this.displayFlags = (emojify = true) => {
                let badgeArray = [];
                try { this.flags.toArray().filter(badge => badge !== "VERIFIED_DEVELOPER"); } catch (e) { return []; }
                let flags = this.flags.toArray().filter(badge => badge !== "VERIFIED_DEVELOPER");
                for (const flag of flags) {
                    badgeArray.push(badges[flag])
                }
                if (this.avatarURL() && ['.gif', '.webm'].some(type => this.avatarURL({ dynamic: true }).endsWith(type))) {
                    badgeArray.push(badges['NITRO']);
                }
                if (!emojify) {
                    if (this.avatarURL() && ['.gif', '.webm'].some(type => this.avatarURL({ dynamic: true }).endsWith(type))) {
                        flags.push('NITRO');
                    }
                    return flags;
                }
                return badgeArray.join(' ');
            }
            this.addAfkPing = async(content) => {
                let array = [];
                let db = this.settings.get(this.id, 'afkPings', array);
                if (db.length < 1) {
                    array.push(content);
                } else {
                    for (let i = 0; i < db.length; i++) {
                        array.push(db[i]);
                    }
                    array.push(content);
                }
                await this.settings.set(this.id, 'afkPings', array);
            }
        }
    }
    return RadaUser;
});