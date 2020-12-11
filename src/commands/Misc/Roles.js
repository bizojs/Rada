const { Command } = require('discord-akairo');

class RolesCommand extends Command {
    constructor() {
        super('roles', {
            aliases: ['roles'],
            category: 'Miscellaneous',
            description: {
                content: 'Displays all roles within the server.',
                permissions: ['EMBED_LINKS', 'MANAGE_MESSAGES']
            },
            clientPermissions: ['EMBED_LINKS', 'MANAGE_MESSAGES']
        });
    }

    async exec(message) {
        let roleList = message.guild.roles.cache.map(r => `${r} - \`${r.name}\`, created ${this.client.daysBetween(r.createdTimestamp).toFixed(0) > 0 ? `${this.client.daysBetween(r.createdTimestamp).toFixed(0)} day${this.client.daysBetween(r.createdTimestamp).toFixed(0) > 1 ? 's' : ''} ago` : 'today'}`);
        if (roleList.length < 1) {
            return message.util.send('This server has no roles to display.');
        }
        const pages = this.client.chunkify(roleList, 10);
        let embeds = [];
        if (pages.length < 2) {
            return message.util.send({embed: this.client.util.embed()
                .setTitle(`**${message.guild.name}** roles`)
                .setColor(this.client.color)
                .setThumbnail(this.client.avatar)
                .setDescription(roleList)
                .setFooter(`Requested by ${message.author.username}`)
                .setTimestamp()
            })
        }
        for (let i = 0; i < pages.length; i++) {
            let embed = this.client.util.embed()
                .setTitle(`**${message.guild.name}** roles`)
                .setColor(this.client.color)
                .setThumbnail(this.client.avatar)
                .setDescription(pages[i])
                .setFooter(`Page ${i+1} of ${pages.length} | Requested by ${message.author.username}`)
                .setTimestamp()
            embeds.push(embed);
        }
        message.paginate(embeds);
    }
}

module.exports = RolesCommand;