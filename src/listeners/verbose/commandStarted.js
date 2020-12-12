const { Listener } = require('discord-akairo');

module.exports = class CommandStarted extends Listener {
    constructor() {
        super('commandStarted', {
            emitter: 'commandHandler',
            event: 'commandStarted'
        });
    }

    exec(message, command) {
        if (this.client.settings.get(this.client.id, 'debug')) {
            const user = `${message.author.tag}[${message.author.id}]`;
            const cmd = `(${command.id}${message.util.parsed.content ? `, ${message.util.parsed.content}` : ''})`;
            const channel = `#${message.channel.name}[${message.channel.id}]`;
            const guild = `${message.guild.name}[${message.guild.id}]`;
            this.client.log.commandStarted(user, cmd, channel, guild);
        }
    }
}