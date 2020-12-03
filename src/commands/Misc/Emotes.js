const { Command } = require('discord-akairo');

class EmotesCommand extends Command {
    constructor() {
        super('emotes', {
            aliases: ['emotes'],
            category: 'Miscellaneous',
            description: {
                content: 'Displays all emotes within the server.',
                permissions: ['EMBED_LINKS']
            }
        });
    }

    async exec(message) {
        let emojiList = message.guild.emojis.cache.map(e => `${e} - **${e.name}**, created ${this.client.daysBetween(e.createdTimestamp).toFixed(0) > 0 ? `**${this.client.daysBetween(e.createdTimestamp).toFixed(0)} days ago**` : '**today**'}`);
        if (emojiList.length < 1) {
            return message.channel.send('This server has no emotes to display.');
        }
        const pages = this.client.chunkify(emojiList, 20);
        if (pages.length < 2) {
            return message.channel.send({embed: this.client.util.embed()
                .setColor(this.client.color)
                .setThumbnail(this.client.avatar)
                .setDescription(emojiList)
                .setTitle(`**${message.guild.name}** emotes`)
                .setTimestamp()
            })
        }
        message.paginate(pages, `**${message.guild.name}** emotes`, 'description');
    }
}

module.exports = EmotesCommand;
