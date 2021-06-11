const { Listener } = require('discord-akairo');
const { readdirSync } = require('fs');

module.exports = class ReadyListener extends Listener {
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
                name: `https://radabot.net | ${this.client.guilds.cache.size} servers`,
                type: 'WATCHING'
            }
        });
        this.client.log.success(`Connected to the Discord API`);
        this.client.log.success(`Logged into as ${this.client.user.tag}`);
        if (process.platform !== 'linux') {
            if (!this.client.settings.get(this.client.id, 'debug')) {
                // this.client.Cli.start();
            }
        }
    }
}