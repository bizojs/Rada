const { Listener } = require('discord-akairo');

module.exports = class GuildBanRemoveListener extends Listener {
    constructor() {
        super('guildBanRemove', {
            emitter: 'client',
            event: 'guildBanRemove'
        });
    }

    async exec(guild, user) {
        let logs = guild.channels.cache.get(guild.settings.get(guild.id, 'logs'));
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setAuthor('User unbanned')
            .setTimestamp()
        if (logs) {
            embed.addField('User', `${user} \`${user.tag} [${user.id}]\``)
                .setThumbnail(user.avatarURL({ dynamic: true }))
            return logs.send(embed);
        }
    }
};