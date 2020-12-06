const { Command } = require('discord-akairo');

module.exports = class extends Command {
    constructor() {
        super('1337', {
            aliases: ['1337', 'leet'],
            category: 'Text',
            description: {
                content: 'Send your text as 1337 text',
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
            let leet = this.client.leet(text);
            if (leet.length > 1999) {
                return message.responder.error('**Please provide less text**');
            }
            return message.util.send(leet);
        } catch (e) {
            return message.responder.error(e.message);
        }
    }
}