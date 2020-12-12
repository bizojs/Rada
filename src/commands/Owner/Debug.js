const { Command } = require('discord-akairo');

module.exports = class DebugCommand extends Command {
    constructor() {
        super('debug', {
            aliases: ['debug'],
            category: 'Owner',
            ownerOnly: true,
            description: {
                content: 'Enable/disable debugging / console logging commands',
                permissions: []
            },
            args: [{
                id: 'toggle',
                type: 'lowercase',
                default: null
            }]
        })
    }
    async exec(message, { toggle }) {
        let current = this.client.settings.get(this.client.user.id, 'debug', false);
        if (!toggle) {
            return message.responder.error(`**Are you turning debug mode on or off?** It's currently \`${current ? 'on' : 'off'}\``);
        }
        if (toggle === 'on') {
            if (current) {
                return message.responder.error(`**Debug mode is already** \`on\``);
            }
            await this.client.settings.set(this.client.user.id, 'debug', true);
            return message.responder.success(`**You have turned debug mode** \`on\``);
        }
        if (toggle === 'off') {
            if (!current) {
                return message.responder.error(`**Debug mode is already** \`on\``);
            }
            await this.client.settings.set(this.client.user.id, 'debug', false);
            return message.responder.success(`**You have turned debug mode** \`off\``);
        }
    }
}