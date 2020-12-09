const { Command } = require('discord-akairo');
const req = require('@aero/centra');

class UrbanCommand extends Command {
    constructor() {
        super('urban', {
           aliases: ['urban', 'urbandictionary'],
           category: 'Miscellaneous',
           description: {
             content: 'Search urban dictionary for a word or phrase and get the first result',
             permissions: ['EMBED_LINKS']  
           },
           args: [{
               id: 'query',
               type: 'string',
               match: 'rest'
           }]
        });
    }

    userPermissions(message) {
        if (!message.channel.nsfw) {
            return message.util.send('🔞 **This command must be used in an NSFW marked channel**');
        }
        return null;
    }

    async exec(message, args) {
        let search = args.query.split(" ").join("+");
        const data = await req(`http://api.urbandictionary.com/v0/define?term=${search}`).json();
        let result = data.list;
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setThumbnail(this.client.avatar)
            .setFooter(`Requested by ${message.author.username}`)
            .setTimestamp()
        const pages = this.client.chunkify(result, 1);
        if (result[0]) {
            if (result.length < 2) {
                embed.setTitle(`**${data.list[0].word}** by ${data.list[0].author}`)
                    .setDescription(`${this.trim(data.list[0].definition, 1950, data.list[0].permalink) || 'No definition'}`)
                    .addField('Example', `${this.trim(data.list[0].example, 950, data.list[0].permalink) || 'No example'}`)
                    .addField('Votes', `:thumbsup: ${data.list[0].thumbs_up} upvotes\n:thumbsdown: ${data.list[0].thumbs_down} downvotes`)
                    .addField('Link', `**${data.list[0].permalink}**`, true)
                    .addField('Mug', `**[Buy a __${data.list[0].word}__ mug here](https://urbandictionary.store/products/mug?defid=${data.list[0].defid})**`, true)
                return message.util.send(embed)
            }
            let embeds = [];
            for (let i = 0; i < pages.length; i++) {
                let embed = this.client.util.embed()
                    .setTitle(`**${pages[i][0].word}** by ${pages[i][0].author}`)
                    .setColor(this.client.color)
                    .setThumbnail(this.client.avatar)
                    .setDescription(`${this.trim(pages[i][0].definition, 1950, pages[i][0].permalink) || 'No definition'}`)
                    .addField('Example', `${this.trim(pages[i][0].example, 950, pages[i][0].permalink) || 'No example'}`)
                    .addField('Votes', `:thumbsup: ${pages[i][0].thumbs_up.toLocaleString()} upvotes\n:thumbsdown: ${pages[i][0].thumbs_down.toLocaleString()} downvotes`)
                    .addField('Link', `**${pages[i][0].permalink}**`, true)
                    .addField('Mug', `**[Buy a __${pages[i][0].word}__ mug here](https://urbandictionary.store/products/mug?defid=${pages[i][0].defid})**`, true)
                    .setFooter(`Page ${i+1} of ${pages.length} | Requested by ${message.author.username}`)
                    .setTimestamp()
                embeds.push(embed);
            }
            message.paginate(embeds);
        } else {
            embed.setTitle('Urban dictionary search')
            .setDescription(`No results on urban dictionary have been found for \`${args.query}\``)
            return message.util.send(embed);
        }
    }
    trim = (str, max = 30, link) => {
        if (str.length > max) return `${str.substr(0, max)}**[...view the rest here](${link})**`;
        return str;
    };
}

module.exports = UrbanCommand;