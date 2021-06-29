const { Command } = require('discord-akairo');

module.exports = class extends Command {
    constructor() {
        super('Mock', {
            aliases: ['mock'],
            category: 'Text',
            description: {
                content: 'Mock your text like the spongebob meme.',
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
        if (!text) return message.responder.error('**Please provide some text**')
        try {
            let mock = this.client.mock(text);
            if (mock.length > 1999) {
                return message.responder.error('**Please provide less text**');
            }
            return message.util.send(mock);
        } catch (e) {
            return message.responder.error(e.message);
        }
    }
}