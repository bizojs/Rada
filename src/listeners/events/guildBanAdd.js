const { Listener } = require('discord-akairo');

module.exports = class GuildBanAddListener extends Listener {
    constructor() {
        super('guildBanAdd', {
            emitter: 'client',
            event: 'guildBanAdd'
        });
    }

    async exec(guild, user) {
        let logs = guild.channels.cache.get(guild.settings.get(guild.id, 'logs'));
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setAuthor('User banned')
            .setTimestamp()
        if (logs) {
            embed.addField('User', `${user} \`${user.tag} [${user.id}]\``)
                .setThumbnail(user.avatarURL({ dynamic: true }))
            return logs.send(embed);
        }
    }
};