const { Command } = require('discord-akairo');

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
            },
            {
                id: 'results',
                match: 'option',
                flag: '--results=',
                default: 1
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
        if (args.results && args.results > 10) {
            return message.responder.error('The \`--results=\` can\'t be higher than 10.')
        }
        let term = args.query.split(" ").join("+");
        let searching = await message.channel.send(`${this.client.emojis.cache.get('800521087258722315')} Searching for \`${args.query}\`...`);
        try {
            let results = await this.client.search(term, args.results)
            if (results.length < 1) {
                embed.setDescription('No results were found for your query... Please try again.')
                return searching.edit("", embed)
            }
            embed.setTitle(`Google search - **${this.client.Util.toTitleCase(args.query)}** ${args.results === 1 ? '\`(Top result)\`' : `\`(Top ${args.results} results)\``}`);
            embed.setURL(`https://www.google.co.uk/search?q=${term}`)
            for (const result of results) {
                embed.addField(`**${result.title}**`,result.snippet.length > 0 ? `${this.client.Util.trimString(result.snippet, 250)} [__view here__](${result.link})` : result.link)
            }
            return searching.edit("", embed)
        } catch (e) {
            return searching.edit(e.message)
        }
    }
}
