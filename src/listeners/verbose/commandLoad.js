const { Listener } = require('discord-akairo');

module.exports = class CommandLoad extends Listener {
    constructor() {
        super('commandLoad', {
            emitter: 'commandHandler',
            event: 'load'
        });
    }

    exec(command, isReload) {
        if (this.client.verbose) {
            const cmd = [command.id, command.category.id].join(', ');
            const reload = isReload;
            this.client.log.commandLoad(cmd, reload);
        }
    }
}