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