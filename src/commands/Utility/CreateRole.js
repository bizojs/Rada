const { Command } = require('discord-akairo');

class CreateRoleCommand extends Command {
    constructor() {
        super('createrole', {
            aliases: ['createrole', 'cr', 'addrole'],
            category: 'Utility',
            description: {
                content: 'Create a role in the server.',
                permissions: ['MANAGE_ROLES']
            },
            args: [{
                    id: 'role',
                    type: 'string',
                    match: 'rest',
                    default: null
                },
                {
                    id: 'color',
                    match: 'option',
                    flag: '--color=',
                    default: null
                },
                {
                    id: 'hoist',
                    match: 'option',
                    flag: '--hoist=',
                    default: false
                },
                {
                    id: 'mention',
                    match: 'option',
                    flag: '--mention=',
                    default: false
                }
            ],
            userPermissions: ['MANAGE_ROLES'],
            clientPermissions: ['MANAGE_ROLES']
        })
    }

    async exec(message, { role, color, hoist, mention }) {
        if (!role) {
            return message.responder.error(`**Please provide a name for the new role**`);
        }
        try {
            message.guild.roles.create({
                    data: {
                        name: role,
                        color: color,
                        mentionable: mention,
                        hoist: hoist
                    },
                    reason: `Role created by ${message.author.tag}`
                })
                .then((r) => {
                    return message.responder.success(`**The role __${r.name}__ has been created**\nAdditional details:\nColor: \`${color ? color : 'Default'}\`\nHoist: ${r.hoist ? message.emotes.checked : message.emotes.unchecked}\nMentionable: ${r.mentionable ? message.emotes.checked : message.emotes.unchecked}`);
                })
        } catch (e) {
            return message.responder.error(`**${e.message}**`);
        }
    }
}
module.exports = CreateRoleCommand;