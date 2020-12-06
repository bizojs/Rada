const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const req = require('@aero/centra');
const config = require('../../../src/config');

class StealEmoteCommand extends Command {
    constructor() {
        super('stealemote', {
           aliases: ['stealemote', 'steal', 'borrow', 'borrowemote'],
           category: 'Utility',
           description: {
               content: 'Imagine stealing emotes :eyes:',
               permissions: ['MANAGE_EMOJIS']
           },
           args: [{
              id: 'emote',
              type: 'string'
           }],
           userPermissions: ['MANAGE_EMOJIS'],
        });
    }
    clientPermissions(message) {
        if (!message.guild.me.permissions.has('MANAGE_EMOJIS')) {
            return message.responder.error('**Please give me permission to manage emojis**');
        }
        return null;
    }
    userPermissions(message) {
        if (!message.member.permissions.has('MANAGE_EMOJIS')) {
            return message.responder.error('**You require the permission to manage emojis**');
        }
        return null;
    }

    async exec(message, args) {
        if(!args.emote) {
            return message.responder.error('**Please provide an emote or emote id**');
        }
        let emote = args.emote;
        let response = message.content.split(" ")[0].replace(this.client.settings.get(message.guild.id, 'prefix', config.production ? config.prefix : config.devPrefix), "").includes("borrow") ? "borrowed" : "stolen";
        try {
            let emoji = this.client.emojis.get(emote.split(':').pop().replace(/>/g, ''));
            await message.guild.emojis.create(emoji.url, emoji.name, {
                reason: `Emote ${response.toUpperCase()} by ${message.author.tag}`
            }).then(e => {
                return message.util.send(`The emote ${e} has been ${response} :D`);
            })
        } catch (e) {
            let whatTheFuck = emote.replace(/<a+/g, '').replace(/<+/g, '').replace(/:+/g, '').replace(/>+/g, '').replace(/[0-9]/g, '')
            let id = emote.split(/:+/g).pop().replace(/>+/g, '');
            let extention = emote.startsWith('<a:') ? '.gif' : '.png';
            const res = await req(`https://cdn.discordapp.com/emojis/${id}${emote.startsWith('<a:') ? '.gif' : '.png'}?v=1`, 'GET').send()
            if (res.statusCode === 404) {
                return message.responder.error('**That is not a valid emote**');
            }
            await message.guild.emojis.create(`https://cdn.discordapp.com/emojis/${id}${extention}?v=1`, whatTheFuck ? whatTheFuck : 'not_provided', {
                reason: `Emote ${response.toUpperCase()} by ${message.author.tag}`
            }).then(e => {
                return message.util.send(`The emote ${e} has been ${response} :D`);
            })
        }
    }
}

module.exports = StealEmoteCommand;