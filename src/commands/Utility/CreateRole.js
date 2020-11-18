const { Command } = require('discord-akairo');

class CreateRoleCommand extends Command {
    constructor() {
        super('createrole', {
            aliases: ['createrole', 'cr', 'addrole'],
            description: {
                content: 'Create a role in the server.',
                permissions: ['MANAGE_ROLES']
            },
            args: [{
                id: 'role',
                type: 'string',
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
            return message.responder.error(`**Please provide a name for the new role**`);
        }
        try {
            message.guild.roles.create({
                data: {
                  name: role
                },
                reason: `Role created by ${message.author.tag}`
            })
            .then((r) => {
                return message.responder.success(`**The role __${r.name}__ has been created**`);
            })
        } catch (e) {
            return message.responder.error(`**${e.message}**`);
        }
    }
}
module.exports = CreateRoleCommand;