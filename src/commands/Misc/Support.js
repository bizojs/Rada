const { Command } = require('discord-akairo');

class SupportCommand extends Command {
    constructor() {
      super('support', {
        aliases: ['support'],
        category: 'Miscellaneous',
        description: {
            content: 'Need help? Come join the Rada server, we\'d love to help!',
            permissions: []
        }
      });
    }

    async exec(message) {
        return message.responder.success('**You can join the Rada server here** https://discord.gg/4yKZVQ2cQh')
    }
}

module.exports = SupportCommand;