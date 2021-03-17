const { Command } = require('discord-akairo');
const fetch = require('@aero/centra')
const qs = require('querystring');

module.exports = class DocsCommand extends Command {
    constructor() {
        super('docs', {
            aliases: ['docs', 'discord.js'],
            category: 'Utility',
            description: {
                content: 'Search discord.js docs',
                permissions: ['EMBED_LINKS'],
            },
            args: [{
                    id: 'query',
                    type: 'lowercase',
                    match: 'rest'
                },
                {
                    id: 'source',
                    match: 'option',
                    flag: '--src=',
                    default: 'stable'
                }
            ],
            clientPermissions: ['EMBED_LINKS']
        });
        this.sources = ['stable', 'master', 'rpc', 'commando', 'v11']
    }

    async exec(message, { query, source }) {
        if (!query) {
            return message.responder.error('**Input something to search for**');
        }
        if (!this.sources.includes(source)) {
            source = 'https://raw.githubusercontent.com/discordjs/discord.js/docs/stable.json'
        }
        if (source === 'v11') {
            source = `https://raw.githubusercontent.com/discordjs/discord.js/docs/${source}.json`;
        }
        const q = query.split(' ');
        const queryString = qs.stringify({ src: source, q: q.join(' ') });
        const embed = await fetch(`https://djsdocs.sorta.moe/v2/embed?${queryString}`).json();
        if (!embed) {
            return message.responder.error('**Unable to find your query**');
        }
        return message.util.send({ embed });
    }
}