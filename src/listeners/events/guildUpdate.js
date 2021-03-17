const { Listener } = require('discord-akairo');

module.exports = class guildUpdate extends Listener {
    constructor() {
        super('guildUpdate', {
            emitter: 'client',
            event: 'guildUpdate'
        });
    }

    exec(oldGuild, newGuild) {
        let logs = oldGuild.guild.channels.cache.get(oldGuild.guild.settings.get(oldGuild.guild.id, 'logs'));
        let GuildUpdateEmote = this.client.emojis.cache.find(e => e.name === "server_update");
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setAuthor('Guild update', GuildUpdateEmote.url)
            .setTimestamp()
        if (logs) {
            if (oldGuild.region !== newGuild.region) {
                embed.setDescription('The voice region has been updated')
                    .addField('Before', oldGuild.region, true)
                    .addField('After', newGuild.region, true)
                return logs.send(embed);
            } else
            if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
                embed.setDescription('The verification level has been updated')
                    .addField('Before', oldGuild.verificationLevel, true)
                    .addField('After', newGuild.verificationLevel, true)
                return logs.send(embed);
            } else
            if (oldGuild.afkChannel !== newGuild.afkChannel) {
                embed.setDescription('The afk channel has been updated')
                    .addField('Before', oldGuild.afkChannel.name ? oldGuild.afkChannel.name : 'N/A', true)
                    .addField('After', newGuild.afkChannel.name ? newGuild.afkChannel.name : 'N/A', true)
                return logs.send(embed);
            } else
            if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
                embed.setDescription('The afk timeout has been updated')
                    .addField('Before', oldGuild.afkTimeout + 's', true)
                    .addField('After', newGuild.afkTimeout + 's', true)
                return logs.send(embed);
            } else
            if (oldGuild.name !== newGuild.name) {
                embed.setDescription('The server name has been updated')
                    .addField('Before', oldGuild.name, true)
                    .addField('After', newGuild.name, true)
                return logs.send(embed);
            } else
            if (oldGuild.defaultMessageNotifications !== newGuild.defaultMessageNotifications) {
                embed.setDescription('The default message notifications has been updated')
                    .addField('Before', oldGuild.defaultMessageNotifications, true)
                    .addField('After', newGuild.defaultMessageNotifications, true)
                return logs.send(embed);
            } else
            if (oldGuild.owner !== newGuild.owner) {
                embed.setDescription('The default message notifications has been updated')
                    .addField('Before', `${oldGuild.owner} \`[${oldGuild.owner.id}]\``, true)
                    .addField('After', `${newGuild.owner} \`[${newGuild.owner.id}]\``, true)
                return logs.send(embed);
            }
        }
    }
}