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
        let ChannelUpdateEmote = this.client.emojis.cache.find(e => e.name === "channel_update");
        let logs = oldChannel.guild.channels.cache.get(oldChannel.guild.settings.get(oldChannel.guild.id, 'logs'));
        let embed = this.client.util.embed()
            .setDescription(`The channel ${newChannel} has been updated`)
            .setAuthor('Channel update', ChannelUpdateEmote.url)
            .setColor(this.client.color)
            .setTimestamp()
        if (logs) {
            if (oldChannel.name !== newChannel.name) {
                embed.addField('Old name', oldChannel.name, true)
                    .addField('New name', newChannel.name, true)
                return logs.send(embed);
            }
            if (oldChannel.nsfw !== newChannel.nsfw) {
                embed.addField('Old nsfw', oldChannel.nsfw ? 'Enabled' : 'Disabled', true)
                    .addField('New nsfw', newChannel.nsfw ? 'Enabled' : 'Disabled', true)
                return logs.send(embed);
            }
            if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser) {
                embed.addField('Old slowmode', `${oldChannel.rateLimitPerUser > 60 ? oldChannel.rateLimitPerUser / 60 > 59 ? `${oldChannel.rateLimitPerUser / 60 / 60} hour${oldChannel.rateLimitPerUser / 60 / 60 === 1 ? '' : 's'}` : `${oldChannel.rateLimitPerUser / 60} minutes` : `${oldChannel.rateLimitPerUser} seconds`}`, true)
                    .addField('New slowmode', `${newChannel.rateLimitPerUser > 60 ? newChannel.rateLimitPerUser / 60 > 59 ? `${newChannel.rateLimitPerUser / 60 / 60} hour${newChannel.rateLimitPerUser / 60 / 60 === 1 ? '' : 's'}` : `${newChannel.rateLimitPerUser / 60} minutes` : `${newChannel.rateLimitPerUser} seconds`}`, true)
                return logs.send(embed);
            }
            if (oldChannel.topic !== newChannel.topic) {
                embed.addField('Old topic', oldChannel.topic ? oldChannel.topic : 'N/A', true)
                    .addField('New topic', newChannel.topic ? newChannel.topic : 'N/A', true)
                return logs.send(embed);
            }
        }
    }
}