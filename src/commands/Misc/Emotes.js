const { Command } = require('discord-akairo');

class EmotesCommand extends Command {
    constructor() {
        super('emotes', {
            aliases: ['emotes'],
            category: 'Miscellaneous',
            description: {
                content: 'Displays all emotes within the server.',
                permissions: ['EMBED_LINKS', 'ATTACH_FILES']
            }
        });
    }

    async exec(message) {
        let emojiList = message.guild.emojis.cache.map(e => `${e} - **${e.name}**, created ${this.client.daysBetween(e.createdTimestamp).toFixed(0) > 0 ? `**${this.client.daysBetween(e.createdTimestamp).toFixed(0)} days ago**` : '**today**'}`);
        if (emojiList.length < 1) {
            return message.channel.send('This server has no emotes to display.');
        }
        let total_emotes = message.guild.emojis.cache.size;
        let animated_emotes = message.guild.emojis.cache.filter(e => e.animated).size;
        let static_emotes = message.guild.emojis.cache.filter(e => !e.animated).size;
        let full = `${total_emotes} total » ${animated_emotes} animated, ${static_emotes} static\n` + emojiList.join('\n');
        if (full.length > 2000) {
            return message.channel.send('Too many emotes, sending as file instead', new MessageAttachment(Buffer.from(full), 'emotes.txt'))
        } else {
            return message.channel.send(full)
        }

        // let emojiList = message.guild.emojis.cache.map(e => `${e} - **${e.name}**, created ${this.client.daysBetween(e.createdTimestamp).toFixed(0) > 0 ? `**${this.client.daysBetween(e.createdTimestamp).toFixed(0)} days ago**` : '**today**'}`);
        // const pages = this.client.chunkify(emojiList, 2);
        // message.paginate(pages, `**${message.guild.name}** emotes`);
    }
}

module.exports = EmotesCommand;
