const { Command } = require('discord-akairo');
const req = require('@aero/centra');

module.exports = class Search extends Command {
    constructor() {
        super('search', {
            aliases: ['search', 'google'],
            category: 'Miscellaneous',
            description: {
                content: 'Search google for a query and return the first few results',
                permissions: ['EMBED_LINKS']
            },
            cooldown: 30000,
            ratelimit: 1,
            args: [{
                id: 'query',
                type: 'string',
                match: 'rest'
            }],
            clientPermissions: ['EMBED_LINKS']
        })
    }

    async exec(message, args) {
        let embed = this.client.util.embed()
            .setTitle('Google search')
            .setColor(this.client.color)
            .setFooter(`Requested by ${message.author.username}`)
            .setTimestamp()
        if (!args.query) {
            return message.responder.error('You must input something to search on Google.')
        }
        let term = args.query.split(" ").join("+");

        try {
            let results = await this.client.search(term, 10)
            if (results.length < 1) {
                embed.setDescription('No results were found for your query... Please try again.')
                return message.channel.send(embed);
            }
            embed.setTitle(`Google search - **${args.query}**`);
            embed.setURL(`https://www.google.co.uk/search?q=${term}`)
            for (const result of results) {
                embed.addField(`**${result.title}** | __${result.link}__`, result.snippet)
            }
            return message.channel.send(embed);
        } catch (e) {
            return message.channel.send(e.message);
        }
    }
}