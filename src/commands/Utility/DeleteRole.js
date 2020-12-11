const { Command } = require('discord-akairo');

class DeleteRoleCommand extends Command {
    constructor() {
        super('deleterole', {
            aliases: ['deleterole', 'dr'],
            category: 'Utility',
            description: {
                content: 'Deletes a role from the server.',
                permissions: ['MANAGE_ROLES']
            },
            args: [{
                id: 'role',
                type: 'role',
                match: 'rest',
                default: null
            }],
            userPermissions: ['MANAGE_ROLES'],
            clientPermissions: ['MANAGE_ROLES']
        })
    }

    async exec(message, { role }) {
        if (!role) {
            return message.responder.error(`**Please provide a role to delete**`);
        }
        try {
            await role.delete(`Role deleted by ${message.author.tag}`);
            return message.responder.success(`**The role __${role.name}__ has been deleted**`);
        } catch (e) {
            return message.responder.error(`**${e.message}**`);
        }
    }
}
module.exports = DeleteRoleCommand;