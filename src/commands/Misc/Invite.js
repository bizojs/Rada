const { Command } = require('discord-akairo');

class InviteCommand extends Command {
    constructor() {
        super('invite', {
           aliases: ['invite', 'inv'],
           category: 'Miscellaneous',
           description: {
             content: 'Get the invite link for the bot.',
             permissions: []
           }
        });
    }

    async exec(message) {
      return message.util.send('Coming soon!');
    }
}

module.exports = InviteCommand;