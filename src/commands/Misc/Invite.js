const { Command } = require('discord-akairo');

class InviteCommand extends Command {
    constructor() {
        super('invite', {
           aliases: ['invite', 'inv'],
           category: 'Miscellaneous',
           description: 'Get the invite link for the bot.'
        });
    }

    async exec(message) {
      return message.channel.send('Coming soon!');
    }
}

module.exports = InviteCommand;