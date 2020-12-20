const { Listener } = require('discord-akairo');

module.exports = class channelCreate extends Listener {
    constructor() {
        super('channelCreate', {
            emitter: 'client',
            event: 'channelCreate'
        });
    }

    exec(channel) {
        if (channel.type === "dm") return;
        let time = new Date().toLocaleTimeString();
        let ChannelCreateEmote = this.client.emojis.cache.find(e => e.name === "channel_create");
        let logs = channel.guild.channels.cache.get(channel.guild.settings.get(channel.guild.id, 'logs'));
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setAuthor('Channel created', ChannelCreateEmote.url)
            .setDescription(`A ${channel.type === 'text' ? 'text channel' : channel.type === 'voice' ? 'voice channel' : 'category'} has been created at ${time}`)
            .addField('Name', channel.name, true)
            .addField('ID', channel.id, true)
            .setTimestamp()
        if (logs) {
            return logs.send(embed)
        }
    }
}
