const { Listener } = require('discord-akairo');
const { readdirSync } = require('fs');

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        this.client.log.success(`Loaded ${this.client.listenerHandler.modules.size} listeners`);
        this.client.log.success(`Loaded ${this.client.inhibitorHandler.modules.size} inhibitors`);
        this.client.log.success(`Loaded ${this.client.commandHandler.modules.size} commands`);
        this.client.log.success(`Loaded ${readdirSync(process.cwd() + '/lib/extensions').length - 1} extensions`);
        this.client.log.success(`Loaded ${readdirSync(process.cwd() + '/src/models').length - 1} models`);
    	this.client.presence.set({
            status: 'online',
            activity: {
                name: `${this.client.user.username} v1 in progress`,
                type: 'WATCHING'
            }
        });
        this.client.log.success(`Logged into discord and connected as ${this.client.user.tag}`);
    }
}

module.exports = ReadyListener;