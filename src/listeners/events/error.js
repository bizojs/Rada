const { Listener } = require('discord-akairo');
const { production } = require('../../config');

class ErrorListener extends Listener {
    constructor() {
        super('error', {
            emitter: 'commandHandler',
            event: 'error'
        });
    }

    async exec(error, message) {
        console.log(error)
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setTitle('Error')
            .setDescription(`Guild: **${message.guild.name}**\nUser: \`${message.author.tag} (${message.author.id})\`\nCommand: \`${message.content.split(' ')[0]}\`\n\n${error.stack}`)
            .setTimestamp()
        if (this.client.settings.get(this.client.id, 'debug') && production) {
            this.client.channels.cache.get('787745780432764948').send(embed);
        }
        return message.channel.send(`\`\`\`js\n${error.message}\`\`\``);
    }
};

module.exports = ErrorListener;