const { Command } = require('discord-akairo');
const { MessageEmbed, MessageAttachment } = require('discord.js');

class RolesCommand extends Command {
    constructor() {
        super('roles', {
            aliases: ['roles'],
            category: 'Miscellaneous',
            description: {
                content: 'Displays all roles within the server.',
                permissions: ['EMBED_LINKS', 'ATTACH_FILES']
            }
        });
    }

    async exec(message) {
        let embed = new MessageEmbed()
            .setTitle(`${message.guild.name} roles`)
            .setThumbnail(this.client.avatar)
            .setColor(this.client.color)
            .setFooter(`Requested by ${message.author.username}`)
            .setTimestamp()
        let roleList = message.guild.roles.cache.map(r => `${r} - \`${r.name}\`, created ${this.client.daysBetween(r.createdTimestamp).toFixed(0) > 0 ? `**${this.client.daysBetween(r.createdTimestamp).toFixed(0)} day${this.client.daysBetween(r.createdTimestamp).toFixed(0) > 1 ? 's' : ''} ago**` : '**today**'}`);
        if (roleList.length < 1) {
            return message.channel.send('This server has no roles to display.');
        }
        let full = roleList.join('\n');
        if (full.length > 2048) {
            return message.channel.send('Too many roles, sending as file instead', new MessageAttachment(Buffer.from(full), 'roles.txt'))
        } else {
            embed.setDescription(full)
            return message.channel.send(embed)
        }
    }
}

module.exports = RolesCommand;