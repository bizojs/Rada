const { Listener } = require('discord-akairo');

module.exports = class guildUpdate extends Listener {
    constructor() {
        super('guildUpdate', {
            emitter: 'client',
            event: 'guildUpdate'
        });
    }

    exec(oldGuild, newGuild) {
        let logs = oldGuild.channels.cache.get(oldGuild.settings.get(oldGuild.id, 'logs'));
        let GuildUpdateEmote = this.client.emojis.cache.find(e => e.name === "server_update");
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setAuthor('Guild update', GuildUpdateEmote.url)
            .setTimestamp()
        if (logs) {
            if (oldGuild.owner !== newGuild.owner) {
                embed.addField('Old owner', `${oldGuild.owner} \`[${oldGuild.owner.id}]\``, true)
                    .addField('New owner', `${newGuild.owner} \`[${newGuild.owner.id}]\``, true)
            }
            if (oldGuild.name !== newGuild.name) {
                embed.addField('New name', oldGuild.name, true)
                    .addField('Old name', newGuild.name, true)
                logs.send(embed);
            }
            if (oldGuild.region !== newGuild.region) {
                embed.addField('Old region', oldGuild.region, true)
                    .addField('New region', newGuild.region, true)
            }
            if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
                embed.addField('Old VL', oldGuild.verificationLevel, true)
                    .addField('New VL', newGuild.verificationLevel, true)
            }
            if (oldGuild.afkChannel !== newGuild.afkChannel) {
                embed.addField('Old AFK Channel', oldGuild.afkChannel.name ? oldGuild.afkChannel.name : 'N/A', true)
                    .addField('New AFK Channel', newGuild.afkChannel.name ? newGuild.afkChannel.name : 'N/A', true)
            }
            if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
                embed.addField('Old AFK Timeout', oldGuild.afkTimeout + 's', true)
                    .addField('New AFK Timeout', newGuild.afkTimeout + 's', true)
            }
            if (oldGuild.defaultMessageNotifications !== newGuild.defaultMessageNotifications) {
                embed.setDescription('The default message notifications has been updated')
                    .addField('Before', oldGuild.defaultMessageNotifications, true)
                    .addField('After', newGuild.defaultMessageNotifications, true)
            }
            if (oldGuild.banner !== newGuild.banner) {
                embed.setImage(newGuild.bannerURL({ dynamic: true }))
            }
            if (oldGuild.iconURL() !== newGuild.iconURL()) {
                embed.setThumbnail(newGuild.iconURL({ dynamic: true }))
            }
            if (embed.fields.length < 1) return;
            logs.send(embed);
        }
    }
}