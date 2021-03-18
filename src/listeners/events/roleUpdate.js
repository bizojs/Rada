const { Listener } = require('discord-akairo');

module.exports = class roleUpdate extends Listener {
    constructor() {
        super('roleUpdate', {
            emitter: 'client',
            event: 'roleUpdate',
        });
    }
    async exec(oldRole, newRole) {
        let RoleUpdateEmote = this.client.emojis.cache.find(e => e.name === "role_update");
        let logs = oldRole.guild.channels.cache.get(oldRole.guild.settings.get(oldRole.guild.id, 'logs'));
        let embed = this.client.util.embed()
            .setAuthor('Role updated', RoleUpdateEmote.url)
            .setDescription(`The role ${newRole} has been updated`)
            .setFooter(`Role ID ➜ ${newRole.id}`)
            .setTimestamp()
        if (logs) {
            if (oldRole.name !== newRole.name) {
                embed.addField('Old name', oldRole.name, true)
                    .addField('New name', newRole.name, true)
            }
            if (oldRole.color !== newRole.color) {
                embed.setColor(newRole.hexColor === '#000000' ? '#36393f' : newRole.hexColor)
                    .addField('Old color', oldRole.hexColor, true)
                    .addField('New color', newRole.hexColor, true)
            }
            if (oldRole.mentionable !== newRole.mentionable) {
                embed.addField('Mentionable', newRole.mentionable ? `${oldRole.guild.emotes.checked} enabled` : `${oldRole.guild.emotes.unchecked} disabled`, true)
            }
            if (oldRole.hoist !== newRole.hoist) {
                embed.addField('Hoisted', newRole.hoist ? `${oldRole.guild.emotes.checked} enabled` : `${oldRole.guild.emotes.unchecked} disabled`, true)
            }
            if (embed.fields.length < 1) return;
            logs.send(embed)
        }
    }
}