const { Listener } = require('discord-akairo');
const CustomLog = require('../../../lib/log');
const terminal = new CustomLog;

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        terminal.success(`Loaded ${this.client.listenerHandler.modules.size} listeners`);
        terminal.success(`Loaded ${this.client.inhibitorHandler.modules.size} inhibitors`);
        terminal.success(`Loaded ${this.client.commandHandler.modules.size} commands`);
    	this.client.presence.set({
            status: 'online',
            activity: {
                name: `${this.client.user.username} v1 in progress`,
                type: 'WATCHING'
            }
        });
        terminal.success(`Logged into discord and connected as ${this.client.user.tag}`);
    }
}

module.exports = ReadyListener;