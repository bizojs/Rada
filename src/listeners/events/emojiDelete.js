const { Listener } = require('discord-akairo');

module.exports = class emojiDelete extends Listener {
    constructor() {
        super('emojiDelete', {
            emitter: 'client',
            event: 'emojiDelete'
        });
    }

    exec(emoji) {
        let logs = emoji.guild.channels.cache.get(emoji.guild.settings.get(emoji.guild.id, 'logs'));
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setAuthor('Emote deleted', emoji.url)
            .setThumbnail(emoji.url)
            .addField('Name', emoji.name, true)
            .addField('ID', emoji.id, true)
            .setTimestamp()
        if (logs) {
            return logs.send(embed)
        }
    }
}
