const { Command } = require('discord-akairo');

module.exports = class extends Command {
    constructor() {
        super('emojify', {
            aliases: ['emojify'],
            category: 'Text',
            description: {
                content: 'Send your text as regional indicator emojis',
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
        try {
            let emojified = this.client.emojify(text);
            if (emojified.length > 1999) {
                return message.responder.error('**Please provide less text**');
            }
            return message.channel.send(emojified);
        } catch (e) {
            return message.responder.error(e.message);
        }
    }
}