const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class ReverseCommand extends Command {
    constructor() {
        super('reverse', {
           aliases: ['reverse', 'rev'],
           category: 'Miscellaneous',
           description: 'Reverse a string'
        });
    }

    async exec(message, args) {
      return message.channel.send(this.client.reverse(message.util.parsed.content));
    }
}

module.exports = ReverseCommand;