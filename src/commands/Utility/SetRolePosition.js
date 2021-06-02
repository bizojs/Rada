const { Command } = require('discord-akairo');

module.exports = class SetRolePositionCommand extends Command {
    constructor() {
        super('setroleposition', {
            aliases: ['setroleposition', 'srp'],
            category: 'Utility',
            description: {
                content: 'Change the position of a role.',
                permissions: ['MANAGE_ROLES']
            },
            separator: ',',
            args: [{
                id: 'role',
                type: 'role',
                default: null
            }, {
                id: 'position',
                type: 'string',
                default: null
            }],
            userPermissions: ['MANAGE_ROLES'],
            clientPermissions: ['MANAGE_ROLES']
        })
    }

    async exec(message, { role, position }) {
        if (!role) {
            return message.responder.error(`**Please provide a role to change the position for**`);
        }
        if (role.position >= message.guild.me.roles.highest.position) {
            return message.responder.error(`**The role you provided is higher than my highest role**`);
        }
        if (!position) {
            return message.responder.error(`**Please provide a new position for the role** (The current position is \`${role.position}\`)\nThe highest role position in this server is \`${message.guild.roles.highest.position}\``);
        }
        if (position >= message.guild.me.roles.highest.position) {
            return message.responder.error(`**The new position you provided is higher than my highest role**\nPlease choose a new position *below* \`${message.guild.me.roles.highest.position}\``);
        }
        let oldPosition = role.position;
        try {
            await role.edit({
                position: position
            }, `Role position changed from ${oldPosition} to ${position} by ${message.author.tag}`);
            return message.responder.success(`**The role __${role.name}__'s position has been changed from \`${oldPosition}\` to \`${position}\`**`);
        } catch (e) {
            return message.responder.error(`**${e.message}**`);
        }
    }
}
