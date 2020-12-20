const { Listener } = require('discord-akairo');
const ms = require('ms');

module.exports = class Cooldown extends Listener {
    constructor() {
        super('cooldown', {
            emitter: 'commandHandler',
            event: 'cooldown'
        });
        this.cache = new Set();
    }

    exec(message, command, remaining) {
        const key = `${message.author.id}-cooldown`;
        if (this.cache.has(key)) {
            return;
        }
        this.cache.add(key);
        setTimeout(() => { this.cache.delete(key) }, 3000);
        return message.responder.error(`**That command is on cooldown for another \`${ms(remaining, { long: true })}\`**`)
    }
}