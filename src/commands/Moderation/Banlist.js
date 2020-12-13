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
        this.placeholder = 'https://i.br4d.vip/oS0y6Dkx.png'
    }

    async exec(message) {

        const fetched = await message.guild.fetchBans();
        let array = [];
        fetched.forEach(ban => {
            let data = {
                user: new Object(ban.user),
                reason: String(ban.reason ? ban.reason : '⚠ No reason found')
            }
            array.push(data);
        })

        const embeds = [];
        for (let i = 0; i < array.length; i++) {
            let embed = this.client.util.embed()
                .setTitle(`Banned users for ${message.guild.name} (${array.length} total)`)
                .addField('Target', `\`${array[i].user.tag} (${array[i].user.id})\``)
                .addField('Reason', `${array[i].reason}`)
                .setThumbnail(array[i].user.avatarURL() ? array[i].user.avatarURL({size: 512}).replace('webp', 'png').replace('webm', 'gif') : this.placeholder)
                .setColor(this.client.color)
            embeds.push(embed);
        }
        return message.paginate(embeds);
    }


}