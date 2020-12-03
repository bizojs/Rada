const { Command } = require('discord-akairo');
const { MessageEmbed, MessageAttachment } = require('discord.js');

class RolesCommand extends Command {
    constructor() {
        super('roles', {
            aliases: ['roles'],
            category: 'Miscellaneous',
            description: {
                content: 'Displays all roles within the server.',
                permissions: ['EMBED_LINKS']
            }
        });
    }

    async exec(message) {
        let roleList = message.guild.roles.cache.map(r => `${r} - \`${r.name}\`, created ${this.client.daysBetween(r.createdTimestamp).toFixed(0) > 0 ? `${this.client.daysBetween(r.createdTimestamp).toFixed(0)} day${this.client.daysBetween(r.createdTimestamp).toFixed(0) > 1 ? 's' : ''} ago` : 'today'}`);
        if (roleList.length < 1) {
            return message.channel.send('This server has no roles to display.');
        }
        const pages = this.client.chunkify(roleList, 10);
        if (pages.length < 2) {
            return message.channel.send({embed: this.client.util.embed()
                .setColor(this.client.color)
                .setThumbnail(this.client.avatar)
                .setDescription(roleList)
                .setTitle(`**${message.guild.name}** roles`)
                .setTimestamp()
            })
        }
        message.paginate(pages, `**${message.guild.name}** roles`, 'description');
    }
}

module.exports = RolesCommand;