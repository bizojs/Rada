const { Listener } = require('discord-akairo');

module.exports = class WarnListener extends Listener {
    constructor() {
        super('warn', {
            emitter: 'client',
            event: 'warn'
        });
    }

    async exec(info) {
        if (this.client.settings.get(this.client.id, 'debug')) {
            console.log(info);
        }
    }
};