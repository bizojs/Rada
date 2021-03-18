const { Listener } = require('discord-akairo');

module.exports = class DebugListener extends Listener {
    constructor() {
        super('debug', {
            emitter: 'client',
            event: 'debug'
        });
    }

    async exec(info) {
        if (this.client.settings.get(this.client.id, 'debug')) {
            console.log(info);
        }
    }
};