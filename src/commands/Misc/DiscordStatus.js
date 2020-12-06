const { Command } = require('discord-akairo');
const req = require('@aero/centra');
const { emotes, color } = require('../../../lib/constants');

module.exports = class DiscordStatusCommand extends Command {
    constructor() {
        super('discordstatus', {
            category: 'Miscellaneous',
            id: 'discordstatus',
            aliases: ['discordstatus', 'status', 'ds'],
            description: {
                content: 'Get the status of Discord',
                permissions: ['EMBED_LINKS']
            }
        })
        this.baseUrl = 'https://status.discord.com/api/v2';
        this.logo = 'https://i.br4d.vip/ADlDBUxe.png';
        this.colors = {
            none: '#55FFCD',
            minor: '#FF7F50',
            major: '#f05151'
        };
    }
    async exec(message) {
        const summary = await req(this.baseUrl, 'GET').path('summary.json').json();
        const incident = await req(this.baseUrl, 'GET').path('incidents.json').json();

        const components = summary.components.filter(c => !c.group_id);
        const array = [];
        for (let i = 0; i < components.length; i++) {
            array.push(`${components[i].status === 'operational' ? emotes.success : emotes.error} **${components[i].name}**`)
        }
        const previous = [];
        for (let i = 0; i < 3; i++) {
            previous.push(`\`${i+1}.\` [${incident.incidents[i].name}](${incident.incidents[i].shortlink}) (${incident.incidents[i].status})`)
        }
        let embed = this.client.util.embed()
            .setTitle(`Discord Status - ${summary.status.description}`)
            .setColor(this.colors[summary.status.indicator])
            .setURL('https://status.discord.com/')
            .setThumbnail(this.logo)
            .addField('Status', array.join('\n'))
            .addField('Top 3 latest incidents', previous.join('\n'))
            .setFooter(`Requested by ${message.author.username}`)
            .setTimestamp();
        return message.util.send(embed)
    }
}