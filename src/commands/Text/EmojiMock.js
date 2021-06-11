const { Command } = require('discord-akairo');

module.exports = class extends Command {
    constructor() {
        super('emojimock', {
            aliases: ['emojimock'],
            category: 'Text',
            description: {
                content: 'Emoji pasta your text and mock the text at the same time',
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
            let mocked = this.client.mock(text)
            let emojipasta = this.client.generateEmojipasta(mocked);
            if (emojipasta.length > 1999) {
                return message.responder.error('Please provide less text');
            }
            return message.channel.send(emojipasta);
        } catch (e) {
            return message.responder.error(e.message);
        }
    }
}