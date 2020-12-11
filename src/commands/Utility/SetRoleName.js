const { Command } = require('discord-akairo');

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
            }],
            userPermissions: ['MANAGE_ROLES'],
            clientPermissions: ['MANAGE_ROLES']
        })
    }

    async exec(message, { role, name }) {
        if (!role) {
            return message.responder.error(`**Please provide a role to change the name for**`);
        }
        if (!name) {
            return message.responder.error(`**Please provide a new name for the role**\nFormat: \`<role>, <name>\`\nExample: \`${message.guild.prefix}setrolename Admin, Administrator\``);
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