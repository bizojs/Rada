const { Command } = require('discord-akairo');

class CreateRoleCommand extends Command {
    constructor() {
        super('createrole', {
            aliases: ['createrole', 'cr', 'addrole'],
            category: 'Utility',
            description: {
                content: 'Create a role in the server.',
                permissions: ['MANAGE_ROLES'],
                extended: 'The first argument is the role name, the second argument is the color flag \`--color=\`, the third argument is the hoist flag \`--hoist\` and then the last argument is the mention flag \`--mention\`',
                examples: (message) => [
                    `\`${message.guild.prefix}createrole Bob --color=random\``,
                    `\`${message.guild.prefix}createrole Announcements --hoist --mention\``,
                    `\`${message.guild.prefix}createrole boonie --color=#f1b390 --hoist\``,
                ]
            },
            args: [{
                    id: 'role', type: 'string', match: 'rest', default: null
                }, {
                    id: 'color', match: 'option', flag: '--color=', default: null
                }, {
                    id: 'hoist', match: 'flag', flag: '--hoist',
                }, {
                    id: 'mention', match: 'flag', flag: '--mention',
            }],
            userPermissions: ['MANAGE_ROLES'],
            clientPermissions: ['MANAGE_ROLES']
        })
    }

    async exec(message, { role, color, hoist, mention }) {
        if (!role) {
            return message.responder.error(`**Please provide a name for the new role**`);
        }
        let random = this.generateHex();
        try {
            message.guild.roles.create({
                    data: {
                        name: role,
                        color: color && color.toLowerCase() === 'random' ? random : color,
                        mentionable: mention,
                        hoist: hoist
                    },
                    reason: `Role created by ${message.author.tag}`
                })
                .then((r) => {
                    return message.responder.success(`**The role __${r.name}__ has been created**\nAdditional details:\nColor: \`${r.hexColor === '#000000' ? 'Default' : r.hexColor}\`\nHoist: ${r.hoist ? message.emotes.checked : message.emotes.unchecked}\nMentionable: ${r.mentionable ? message.emotes.checked : message.emotes.unchecked}`);
                })
        } catch (e) {
            return message.responder.error(`**${e.message}**`);
        }
    }
    generateHex() {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    }
}
module.exports = CreateRoleCommand;