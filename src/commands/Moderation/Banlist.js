const { Command } = require('discord-akairo');

module.exports = class BanListCommand extends Command {
    constructor() {
        super('banlist', {
            aliases: ['banlist', 'bl'],
            category: 'Moderation',
            description: {
                content: 'Displays the banned members of the server.',
                permissions: ['VIEW_AUDIT_LOG', 'EMBED_LINKS']
            },
            userPermissions: ['VIEW_AUDIT_LOG'],
            clientPermissions: ['VIEW_AUDIT_LOG', 'BAN_MEMBERS']
        });
        this.preventDuplicate = new Set();
    }

    async exec(message) {
        async function fetchAuditBans() {
            let array = [];
            let currentlyBanned = await message.guild.fetchBans();
            await message.guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'})
            .then(audit => {
                audit.entries.filter(entry => currentlyBanned.has(entry.target.id))
                .forEach(entry => {
                    let data = {
                        user: new Object(entry.target),
                        moderator: new Object(entry.executor),
                        reason: String(entry.reason ? entry.reason : '⚠ No reason found'),
                    }
                    array.push(data)
                })
            })
            return array;
        }

        const banned = await fetchAuditBans()
        const embeds = [];
        for (let i = 0; i < banned.length; i++) {
            let embed = this.client.util.embed()
                .setTitle(`Banned users for ${message.guild.name} (${banned.length} total)`)
                .addField('Target', `\`${banned[i].user.tag} (${banned[i].user.id})\``)
                .addField('Moderator', `\`${banned[i].moderator.tag} (${banned[i].moderator.id})\``)
                .addField('Reason', `${banned[i].reason}`)
                .setThumbnail(banned[i].user.avatarURL({size: 512}).replace('webp', 'png').replace('webm', 'gif'))
                .setColor(this.client.color)
            embeds.push(embed);
        }
        return message.paginate(embeds);
    }


}