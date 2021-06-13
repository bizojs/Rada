const { Listener } = require('discord-akairo');

module.exports = class guildMemberUpdate extends Listener {
    constructor() {
        super('guildMemberUpdate', {
            emitter: 'client',
            event: 'guildMemberUpdate'
        });
    }

    exec(oldMember, newMember) {
        let logs = oldMember.guild.channels.cache.get(oldMember.guild.settings.get(oldMember.guild.id, 'logs'));
        let MemberUpdateEmote = this.client.emojis.cache.find(e => e.name === "user_update");
        const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
        const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));
        const added = addedRoles.map(r => r).join(", "); // Added Roles
        const removed = removedRoles.map(r => r).join(", "); // Removed Roles
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setAuthor('Member update', MemberUpdateEmote.url)
            .setTimestamp()
        if (logs) {
            if (oldMember.nickname !== newMember.nickname) {
                embed.setDescription(`**${oldMember.user.tag}**'s nickname has been updated`)
                    .addField('Before', oldMember.nickname ? oldMember.nickname : 'None', true)
                    .addField('After', newMember.nickname ? newMember.nickname : 'None', true)
                return logs.send(embed);
            }
            if (oldMember.roles.cache.size < newMember.roles.cache.size) {
                embed.setDescription(`**${oldMember.user.tag}** has been given ${addedRoles.length > 1 ? 'some roles' : 'a role'}`)
                    .addField('Added', `${added}`)
                return logs.send(embed);
            }
            if (oldMember.roles.cache.size > newMember.roles.cache.size) {
                embed.setDescription(`**${oldMember.user.tag}** has been removed from ${removedRoles.length > 1 ? 'some roles' : 'a role'}`)
                    .addField('Removed', `${removed}`)
                return logs.send(embed);
            }
        }
    }
}