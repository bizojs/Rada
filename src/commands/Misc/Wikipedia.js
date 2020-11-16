const { color: { POSITIVE, VERY_NEGATIVE } } = require('../../../lib/constants');
const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const req = require('@aero/centra');

class Wikipedia extends Command {
    constructor() {
        super('wikipedia', {
           aliases: ['wikipedia', 'wiki'],
           category: 'Miscellaneous',
           description: 'Fetch information about a wiki page'
        })
    }

    async exec(message) {
        if (!message.util.parsed.content) {
            return message.responder.error('You must input something to search on Wikipedia.')
        }
        let term = message.util.parsed.content.split(" ").join("+");
        let search = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + term;

        const data = await req(search, 'GET').json();

        let name = data[1][0];
        let description = data[2][0];
        let url = data[3][0];
        if ([name, description, url].some(it => it === undefined)) {
            return message.responder.error(`Your Wikipedia search for \`${message.util.parsed.content}\` was not found`);
        }
        let embed = new MessageEmbed()
            .setColor(this.client.color)
            .setTitle(`**${name}**`)
            .setDescription(description)
            .addField(`Url`, url)
            .setFooter(`Requested by ${message.author.username}`)
            .setTimestamp()
        return message.channel.send(embed);
    }
}

module.exports = Wikipedia;