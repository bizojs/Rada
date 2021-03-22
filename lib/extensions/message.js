const { Structures } = require('discord.js');
const Responder = require('../structures/Responder');
const Reactor = require('../structures/Reactor');
const Paginator = require('../classes/Paginator');

Structures.extend('Message', Message => {
    class RadaMessage extends Message {
        constructor(...args) {
            super(...args);
            this.responder = new Responder(this);
            this.reactor = new Reactor(this);
            this.reacter = this.reactor;
            this.pagination = new Paginator(this);
            this.regex = {
                invites: /discord(?:(\.(?:me|io|li|gg|com)|sites\.com|list\.me)\/.{0,4}|app\.com.{1,4}(?:invite|api|oauth2).{0,5}\/)\w+/ig
            }
            this.jumplink = this.channel.type === 'dm' ? `https://canary.discord.com/channels/@me/${this.channel.id}/${this.id}` : `https://canary.discord.com/channels/${this.guild.id}/${this.channel.id}/${this.id}`;
            this.emotes = require('../constants').emotes;
            this.emoteID = require('../constants').reactions.id;
        }
        paginate = async(array) => {
            return this.pagination.paginate(array);
        }
        vote = async () => {
            await this.reacter.success();
                  this.reacter.error();
            return true;
        }
    }
    return RadaMessage;
});