const { Command } = require('discord-akairo');
const { production, prefix, devPrefix } = require('../../config');

class SetRoleNameCommand extends Command {
    constructor() {
        super('setrolename', {
            aliases: ['setrolename', 'srn'],
            category: 'Utility',
            description: {
                content: 'Change the name of a role.',
                permissions: ['MANAGE_ROLES']
            },
            separator: ',',
            args: [{
                id: 'role',
                type: 'role',
                default: null
            },
            {
                id: 'name',
                type: 'string',
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
    async exec(message, { role, name }) {
        if (!role) {
            return message.responder.error(`**Please provide a role to change the name for**`);
        }
        if (!name) {
            return message.responder.error(`**Please provide a new name for the role**\nFormat: \`<role>, <name>\`\nExample: \`${this.client.settings.get(message.guild.id, 'prefix', production ? prefix : devPrefix)}setrolename Admin, Administrator\``);
        }
        let oldName = role.name;
        try {
            await role.edit({
                name: name
            }, `Role name changed from ${oldName} to ${name} by ${message.author.tag}`);
            return message.responder.success(`**The role __${oldName}__'s name has been changed to __${role.name}__**`);
        } catch (e) {
            return message.responder.error(`**${e.message}**`);
        }
    }
}
module.exports = SetRoleNameCommand;