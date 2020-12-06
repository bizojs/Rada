const { Command } = require('discord-akairo');

module.exports = class extends Command {
    constructor() {
        super('vaporwave', {
            aliases: ['vaporwave'],
            category: 'Text',
            description: {
                content: 'Ｓｅｎｄ  ｙｏｕｒ  ｔｅｘｔ  ｖａｐｏｒｗａｖｅｄ',
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
            let vaporwaved = this.client.vaporwave(text);
            if (vaporwaved.length > 1999) {
                return message.responder.error('**Please provide less text**');
            }
            return message.util.send(vaporwaved);
        } catch (e) {
            return message.responder.error(e.message);
        }
    }
}