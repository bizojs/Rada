const { Listener } = require('discord-akairo');

module.exports = class messageDeleteBulk extends Listener {
    constructor() {
        super('messageDeleteBulk', {
            emitter: 'client',
            event: 'messageDeleteBulk'
        });
        this.cache = new Set();
    }

    async exec(messages) {
        let messageMap = messages.toJSON();
        let guild = this.client.guilds.cache.get(messageMap[0].guildID);
        let channel = guild.channels.cache.get(messageMap[0].channelID);
        let logs = guild.channels.cache.get(guild.settings.get(guild.id, 'logs'));
        if (logs && channel === logs) return;
        let MessageDeleteEmote = this.client.emojis.cache.find(e => e.name === "message_delete");
        let authors = [];
        for (const msg of messageMap) {
            let fetching = await this.client.users.fetch(msg.author.id)
            this.cache.add(this.client.users.cache.get(fetching.id))
        }
        for (const author of this.cache) authors.push(author);
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setAuthor('Bulk message delete', MessageDeleteEmote.url)
            .setTimestamp()
        if (logs) {
            embed.setDescription(`**${messages.size} messages** in ${channel} have been bulk deleted.\nThe messages were from: \n\n${authors.map(a => a).join(', ')}`)
            return logs.send(embed);
        }
    }
}