const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const req = require('@aero/centra');

class UrbanCommand extends Command {
    constructor() {
        super('urban', {
           aliases: ['urban', 'urbandictionary'],
           category: 'Miscellaneous',
           description: 'Search urban dictionary for a word or phrase and get the first result'
        });
    }

    userPermissions(message) {
        if (!message.channel.nsfw) {
            return message.channel.send('🔞 **This command must be used in an NSFW marked channel**');
        }
        return null;
    }

    async exec(message) {
        let search = message.util.parsed.content.replace('--bypass', '').split(" ").join("+");
        const data = await req(`http://api.urbandictionary.com/v0/define?term=${search}`).json();
        let embed = new MessageEmbed()
            .setColor(this.client.color)
            .setThumbnail(this.client.avatar)
            .setFooter(`Requested by ${message.author.username}`)
            .setTimestamp()
        if (data.list[0]) {
                embed.setTitle(`**${data.list[0].word}** by ${data.list[0].author}`)
                .setDescription(`${this.trim(data.list[0].definition, 1950, data.list[0].permalink) || 'No definition'}`)
                .addField('Example', `${this.trim(data.list[0].example, 950, data.list[0].permalink) || 'No example'}`)
                .addField('Votes', `:thumbsup: ${data.list[0].thumbs_up} upvotes\n:thumbsdown: ${data.list[0].thumbs_down} downvotes`)
                .addField('Link', `**${data.list[0].permalink}**`, true)
                .addField('Mug', `**[Buy a __${data.list[0].word}__ mug here](https://urbandictionary.store/products/mug?defid=${data.list[0].defid})**`, true)
            return message.channel.send(embed)
        } else {
            embed.setTitle('Urban dictionary search')
            .setDescription(`No results on urban dictionary have been found for \`${message.util.parsed.content}\``)
            return message.channel.send(embed);
        }
    }
    trim = (str, max = 30, link) => {
        if (str.length > max) return `${str.substr(0, max)}**[...view the rest here](${link})**`;
        return str;
    };
}

module.exports = UrbanCommand;