const { Inhibitor } = require('discord-akairo');

class Mention extends Inhibitor {
    constructor() {
        super('message', {
            type: 'all'
        });
    }

    exec(message) {
        const pings = [`<@${this.client.user.id}>`, `<@!${this.client.user.id}>`]
        if (pings.some(p => message.content === p)) {
            return message.channel.send(`My prefix in this guild is \`${this.client.settings.get(message.guild.id, 'prefix')}\``);
        }
    }
}

module.exports = Mention;