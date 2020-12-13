const { Inhibitor } = require('discord-akairo');

module.exports = class NSFW extends Inhibitor {
    constructor() {
        super('nsfw', {
            reason: 'nsfw',
            type: 'all'
        });
    }

    exec(message) {
        if (message.content.startsWith(message.guild.prefix)) {
            let command = this.client.commandHandler.findCommand(message.content.replace(message.guild.prefix, '').split(' ')[0]);
            if (command) {
                if (command.nsfw && !message.channel.nsfw) {
                    return message.reply('🔞 | **This command must be used in an NSFW marked channel**');
                }
            }
        }
    }
}