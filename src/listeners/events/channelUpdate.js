const { Listener } = require('discord-akairo');

module.exports = class channelUpdate extends Listener {
    constructor() {
        super('channelUpdate', {
            emitter: 'client',
            event: 'channelUpdate'
        });
    }

    exec(oldChannel, newChannel) {
        if (oldChannel.type === "dm") return;
        let time = new Date().toLocaleTimeString();
        let ChannelUpdateEmote = this.client.emojis.cache.find(e => e.name === "channel_update");
        let logs = oldChannel.guild.channels.cache.get(oldChannel.guild.settings.get(oldChannel.guild.id, 'logs'));
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setTimestamp()
        if (logs) {
            if (oldChannel.name !== newChannel.name) {
                embed.setAuthor('Channel name change', ChannelUpdateEmote.url)
                    .setDescription(`The ${oldChannel.type === 'text' ? 'text channel' : oldChannel.type === 'voice' ? 'voice channel' : 'category'} name was changed at ${time}`)
                    .addField('Old name', oldChannel.name, true)
                    .addField('New name', newChannel.name, true)
                    .addField('ID', newChannel.id)
                return logs.send(embed);
            } else if (oldChannel.topic !== newChannel.topic) {
                embed.setAuthor('Channel topic change', ChannelUpdateEmote.url)
                    .setDescription(`The ${oldChannel.type === 'text' ? 'text channel' : oldChannel.type === 'voice' ? 'voice channel' : 'category'} topic was changed at ${time}`)
                    .addField('Old topic', oldChannel.topic ? oldChannel.topic : 'Not set', true)
                    .addField('New topic', newChannel.topic ? newChannel.topic : 'Not set', true)
                    .addField('ID', newChannel.id)
                return logs.send(embed);
            } else if (oldChannel.nsfw !== newChannel.nsfw) {
                embed.setAuthor('Channel nsfw change', ChannelUpdateEmote.url)
                    .setDescription(`The channel topic was changed at ${time}`)
                    .addField('Old nsfw', oldChannel.nsfw ? 'Enabled' : 'Disabled', true)
                    .addField('New nsfw', newChannel.nsfw ? 'Enabled' : 'Disabled', true)
                    .addField('ID', newChannel.id)
                return logs.send(embed);
            } else if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
                embed.setAuthor('Channel slowmode change', ChannelUpdateEmote.url)
                    .setDescription(`The channel slowmode was changed at ${time}`)
                    .addField('Old slowmode', `${oldChannel.rateLimitPerUser > 60 ? oldChannel.rateLimitPerUser / 60 > 59 ? `${oldChannel.rateLimitPerUser / 60 / 60} hour${oldChannel.rateLimitPerUser / 60 / 60 === 1 ? '' : 's'}` : `${oldChannel.rateLimitPerUser / 60} minutes` : `${oldChannel.rateLimitPerUser} seconds`}`, true)
                    .addField('New slowmode', `${newChannel.rateLimitPerUser > 60 ? newChannel.rateLimitPerUser / 60 > 59 ? `${newChannel.rateLimitPerUser / 60 / 60} hour${newChannel.rateLimitPerUser / 60 / 60 === 1 ? '' : 's'}` : `${newChannel.rateLimitPerUser / 60} minutes` : `${newChannel.rateLimitPerUser} seconds`}`, true)
                    .addField('ID', newChannel.id)
                return logs.send(embed);
            }
        }
    }
}
