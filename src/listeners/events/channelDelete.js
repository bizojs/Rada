const { Listener } = require('discord-akairo');

module.exports = class channelDelete extends Listener {
    constructor() {
        super('channelDelete', {
            emitter: 'client',
            event: 'channelDelete'
        });
    }

    exec(channel) {
        if (channel.type === "dm") return;
        let ChannelDeleteEmote = this.client.emojis.cache.find(e => e.name === "channel_delete");
        let logs = channel.guild.channels.cache.get(channel.guild.settings.get(channel.guild.id, 'logs'));
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setAuthor('Channel deleted', ChannelDeleteEmote.url)
            .setDescription(`A ${channel.type === 'text' ? 'text channel' : channel.type === 'voice' ? 'voice channel' : 'category'} has been deleted`)
            .addField('Name', channel.name, true)
            .addField('ID', channel.id, true)
            .setTimestamp()
        if (logs) {
            logs.send(embed)
        }
    }
}