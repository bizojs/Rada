const { Command } = require('discord-akairo');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const pagination = require('../../../lib/extensions/pagination')
class EmotesCommand extends Command {
    constructor() {
        super('emotes', {
            aliases: ['emotes'],
            category: 'Miscellaneous',
            description: 'Displays all emotes within the server.'
        });
    }

    async exec(message) {
        // let emojiList = message.guild.emojis.cache.map(e => `${e} - **${e.name}**, created ${this.client.daysBetween(e.createdTimestamp).toFixed(0) > 0 ? `**${this.client.daysBetween(e.createdTimestamp).toFixed(0)} days ago**` : '**today**'}`);
        // if (emojiList.length < 1) {
        //     return message.channel.send('This server has no emotes to display.');
        // }
        // let total_emotes = message.guild.emojis.cache.size;
        // let animated_emotes = message.guild.emojis.cache.filter(e => e.animated).size;
        // let static_emotes = message.guild.emojis.cache.filter(e => !e.animated).size;
        // let full = `${total_emotes} total » ${animated_emotes} animated, ${static_emotes} static\n` + emojiList.join('\n');
        // if (full.length > 2000) {
        //     return message.channel.send('Too many emotes, sending as file instead', new MessageAttachment(Buffer.from(full), 'emotes.txt'))
        // } else {
        //     return message.channel.send(full)
        // }
      let emojiList = ['⏪', '⏩']
        let pages = this.client.chunkify(emojiList, 5);
        let embeds = []
        for (var i = 0; i < pages.length; i++) {
            const embed = new MessageEmbed()
            embed.setColor(this.client.color)
            embed.setTitle(`${message.guild.name} emotes`)
            embed.setThumbnail(this.client.avatar)
            embed.setDescription(pages[i])
            embed.setFooter(`Page ${i+1} of ${pages.length} | Requested by ${message.author.username}`)
            embeds.push(embed)
        }
        pagination.paginationE(message, pages, 12000)

    }
}

module.exports = EmotesCommand;
