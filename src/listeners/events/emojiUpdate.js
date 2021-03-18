const { Listener } = require('discord-akairo');

module.exports = class emojiUpdate extends Listener {
    constructor() {
        super('emojiUpdate', {
            emitter: 'client',
            event: 'emojiUpdate'
        });
    }

    exec(oldEmoji, newEmoji) {
        let logs = newEmoji.guild.channels.cache.get(newEmoji.guild.settings.get(newEmoji.guild.id, 'logs'));
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setAuthor('Emote created', newEmoji.url)
            .setThumbnail(newEmoji.url)
            .setTimestamp()
        if (logs) {
            if (oldEmoji.name !== newEmoji.name) {
                embed.setDescription('An emote name has been changed')
                    .addField('Old name', oldEmoji.name, true)
                    .addField('New name', newEmoji.name, true)
                    .addField('ID', oldEmoji.id)
                logs.send(embed)
            }
        }
    }
}