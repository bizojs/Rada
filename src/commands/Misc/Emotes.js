const { Command } = require('discord-akairo');

class EmotesCommand extends Command {
    constructor() {
        super('emotes', {
            aliases: ['emotes'],
            category: 'Miscellaneous',
            description: {
                content: 'Displays all emotes within the server.',
                permissions: ['EMBED_LINKS', 'MANAGE_MESSAGES']
            },
            clientPermissions: ['EMBED_LINKS', 'MANAGE_MESSAGES']
        });
    }

    async exec(message) {
        let emojiList = message.guild.emojis.cache.map(e => `${e} - **${e.name}**, created ${this.client.daysBetween(e.createdTimestamp).toFixed(0) > 0 ? `**${this.client.daysBetween(e.createdTimestamp).toFixed(0)} days ago**` : '**today**'}`);
        if (emojiList.length < 1) {
            return message.util.send('This server has no emotes to display.');
        }
        const pages = this.client.chunkify(emojiList, 10);
        let embeds = [];
        if (pages.length < 2) {
            return message.util.send({embed: this.client.util.embed()
                .setTitle(`**${message.guild.name}** emotes`)
                .setColor(this.client.color)
                .setThumbnail(this.client.avatar)
                .setDescription(emojiList)
                .setFooter(`Requested by ${message.author.username}`)
                .setTimestamp()
            })
        }
        for (let i = 0; i < pages.length; i++) {
            let embed = this.client.util.embed()
                .setTitle(`**${message.guild.name}** emotes`)
                .setColor(this.client.color)
                .setThumbnail(this.client.avatar)
                .setDescription(pages[i])
                .setFooter(`Page ${i+1} of ${pages.length} | Requested by ${message.author.username}`)
                .setTimestamp()
            embeds.push(embed);
        }
        message.paginate(embeds);
    }
}

module.exports = EmotesCommand;
