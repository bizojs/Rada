const { Command } = require('discord-akairo');

module.exports = class extends Command {
    constructor() {
        super('emojipasta', {
            aliases: ['emojipasta'],
            category: 'Text',
            description: {
                content: 'Emoji pasta your text',
                permissions: []
            },
            args: [{
                id: 'text',
                type: 'string',
                match: 'rest',
                default: null
            }]
        })
    }
    async exec(message, { text }) {
        if (!text) {
            return message.util.send("Please provide some text")
        }
        try {
            let emojipasta = this.client.generateEmojipasta(text);
            if (emojipasta.length > 1999) {
                return message.responder.error('Please provide less text');
            }
            return message.channel.send(emojipasta);
        } catch (e) {
            return message.responder.error(e.message);
        }
    }
}