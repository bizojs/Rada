const { Command } = require('discord-akairo');
const req = require('@aero/centra');

class RoleInfoCommand extends Command {
    constructor() {
        super('roleinfo', {
            aliases: ['roleinfo', 'ri'],
            category: 'Miscellaneous',
            description: {
                content: 'Get information about a role',
                permissions: ['EMBED_LINKS']
            },
            args: [{
                id: 'role',
                type: 'role',
                default: message => message.member.roles.highest
            }],
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec(message, args) {
        let role = args.role;
        let hex = role.hexColor.replace(/#/g, "");
        const data = await this.client.flipnote.others.color(hex);
        return message.util.send({
            embed: this.client.util.embed()
                .setThumbnail(this.client.avatar)
                .setColor(`${role.hexColor !== '#000000' ? role.hexColor : this.client.color}`)
                .setTitle(`**${role.name}** role info`)
                .setDescription(`Id: \`${role.id}\`\nColor: [${data.name}](${data.image})\nHex: \`${role.hexColor}\`\nRole users: \`${role.members.size}\`\nRole position: \`${role.position}/${message.guild.roles.highest.position}\`\n${role.mentionable ? message.emotes.checked : message.emotes.unchecked} Mentionable\n${role.hoist ? message.emotes.checked : message.emotes.unchecked} Hoisted\n${role.managed ? message.emotes.checked : message.emotes.unchecked} Managed`)
                .addField(`**Created:**`, `\`${new Date(role.createdAt).toLocaleString()} | ${this.client.daysBetween(role.createdAt).toFixed(0)} days ago\``)
                .setFooter(`Requested by ${message.author.username}`)
                .setTimestamp()
        })
    }
}

module.exports = RoleInfoCommand;