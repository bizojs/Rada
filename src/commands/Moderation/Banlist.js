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
        clientPermissions: ['VIEW_AUDIT_LOG', 'EMBED_LINKS']
      });
    }

    async exec(message) {
        try {
            await message.guild.fetchBans();
        } catch (e) {
            return message.responder.error(e.message);
        }
        const fetched = await message.guild.fetchBans();
        const banList = fetched.map(ban => `\`${ban.user.tag} [${ban.user.id}]\` - ${ban.reason ? ban.reason : 'No reason provided'}\n`);
        if (fetched.size < 1) {
            return message.responder.success('**Awesome, this server has no banned users :>**');
        }
        const pages = this.client.chunkify(banList, 10);
        const embeds = [];
        for (let i = 0; i < pages.length; i++) {
            let embed = this.client.util.embed()
                .setTitle(`Banned users for ${message.guild.name}`)
                .setDescription(pages[i])
                .setThumbnail(message.guild.iconURL({size: 512}).replace('webp', 'png').replace('webm', 'gif'))
                .setColor(this.client.color)
            embeds.push(embed);
        }
        return message.paginate(embeds)
    }
}