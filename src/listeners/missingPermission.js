const { Listener } = require('discord-akairo');

module.exports = class missingPermission extends Listener {
    constructor() {
        super('missingPermission', {
            emitter: 'commandHandler',
            event: 'missingPermissions'
        });
        this.cache = new Set();
    }

    exec(message, command, type, missing) {
        let permFormat = missing.length > 1 ?
            `\`${missing.join(' ').split(' ', missing.length - 1).join('\`, \`').replace(/_/g, ' ').toLowerCase()}\` and \`${missing[missing.length - 1].replace(/_/g, ' ').toLowerCase()}\`` :
            `\`${missing[0].toLowerCase().replace(/_/g, ' ')}\``
        let response = type === 'user' ? 
            `**You require the** ${missing.length === 1 ? `${permFormat} **permission to use this command**` : `**following permission to use this command**: ${permFormat}`}` :
            `**I require the** ${missing.length === 1 ? `${permFormat} **permission to use this command**` : `**following permission to use this command**: ${permFormat}`}`
        const key = `${message.author.id}-cooldown`;
        if (this.cache.has(key)) {
            return;
        }
        this.cache.add(key);
        setTimeout(() => { this.cache.delete(key) }, 3000);
        return message.responder.error(response);
    }
}
