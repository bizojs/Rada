const { Command } = require('discord-akairo');
const { production, prefix, devPrefix } = require('../../config');

class SetRoleColorCommand extends Command {
    constructor() {
        super('setrolecolor', {
            aliases: ['setrolecolor', 'setrolecolour', 'src'],
            description: {
                content: 'Change the color of a role.',
                permissions: ['MANAGE_ROLES']
            },
            separator: ',',
            args: [{
                id: 'role',
                type: 'role',
                default: null
            },
            {
                id: 'color',
                type: 'hex',
                default: null
            }]
        })
    }
    clientPermissions(message) {
        if (!message.guild.me.permissions.has('MANAGE_ROLES')) {
            return message.responder.error('**I require the permission to manage roles**');
        }
        return null
    }
    userPermissions(message) {
        if (!message.member.permissions.has('MANAGE_ROLES')) {
            return message.responder.error('**You require the permission to manage roles to run this command**');
        }
        return null
    }
    async exec(message, { role, color }) {
        if (!role) {
            return message.responder.error(`**Please provide a role to change the color for**`);
        }
        if (!color) {
            return message.responder.error(`**Please provide a new color for the role**\nFormat: \`<role>, <color>\`\nExample: \`${this.client.settings.get(message.guild.id, 'prefix', production ? prefix : devPrefix)}setrolecolor Admin, #ffaabb\``);
        }
        let oldColor = role.hexColor;
        if (oldColor === color) {
            return message.responder.error(`**The color for the role \`${role.name}\` is already __${color}__**`)
        }
        try {
            await role.edit({
                color: color
            }, `Role color changed from ${oldColor} to ${color} by ${message.author.tag}`);
            return message.responder.success(`**The role \`${role.name}\`'s color has been changed from __${oldColor}__ to __${color}__**`);
        } catch (e) {
            return message.responder.error(`**${e.message}**`);
        }
    }
}
module.exports = SetRoleColorCommand;