const { Structures } = require('discord.js');
const model = require('../../src/models/guildSchema');
const { MongooseProvider } = require('discord-akairo');
const { production, prefix, devPrefix } = require('../../src/config');

Structures.extend('Guild', Guild => {
    class RadaGuild extends Guild {
        constructor(...args) {
            super(...args);
            this.settings = new MongooseProvider(model);
            this.settings.init();
            this.settings.delete = (setting) => {
                this.settings.delete(this.id, setting);
                return true;
            }
            this.prefix = this.client.settings.get(this.id, 'prefix', production ? prefix : devPrefix);
            this.muteRole = this.settings.get(this.id, 'muterole', null);
            this.emotes = require('../constants').emotes;
            this.emoteID = require('../constants').reactions.id;
            this.logs = this.settings.get(this.id, 'logs', null);
        }
    }
    return RadaGuild;
});