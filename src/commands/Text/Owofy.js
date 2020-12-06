const { Command } = require('discord-akairo');

module.exports = class extends Command {
    constructor() {
        super('owofy', {
            aliases: ['owofy', 'owo'],
            category: 'Text',
            description: {
                content: 'Send youw text owofied (｡♥‿♥｡)',
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
            let owofied = this.client.owofy(text);
            if (owofied.length > 1999) {
                return message.responder.error('**Please provide less text**');
            }
            return message.util.send(owofied);
        } catch (e) {
            return message.responder.error(e.message);
        }
    }
}