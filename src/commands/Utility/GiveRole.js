const { Command } = require('discord-akairo');
const { emotes } = require('../../../lib/constants');

module.exports = class GiveRoleCommand extends Command {
    constructor() {
        super('giverole', {
            aliases: ['giverole', 'gr'],
            category: 'Utility',
            description: {
                content: 'Give a role to a user',
                permissions: ['MANAGE_ROLES', 'EMBED_LINKS']
            },
            args: [{
                id: 'member',
                type: 'member',
                default: null
            },
            {
                id: 'role',
                type: 'role',
                match: 'rest',
                default: null
            }],
            userPermissions: ['MANAGE_ROLES', 'EMBED_LINKS'],
            clientPermissions: ['MANAGE_ROLES', 'EMBED_LINKS']
        })
    }

    async exec(message, { member, role }) {
        if (!member) {
            return message.responder.error(`**Please provide a user to add a role to**`);
        }
        if (!role) {
            return message.responder.error(`**Please provide a role to add to \`${member.user.tag}\`**`);
        }
        if (member.roles.cache.has(role.id)) {
            return message.responder.error(`\`${member.user.tag}\` already has the role **${role.name}**`);
        }
        let userPosition = role.position - message.member.roles.highest.position;
        let botPosition = role.position - message.guild.me.roles.highest.position;
        if (role.position >= message.member.roles.highest.position && message.author.id !== message.guild.owner.id) {
            return message.responder.error(`**That role is ${userPosition === 0 ? 'equal to your highest role' : `\`${userPosition}\` places higher than your highest role`}**`);
        }
        if (role.position >= message.guild.me.roles.highest.position) {
            return message.responder.error(`**That role is ${botPosition === 0 ? 'equal to my highest role' : `\`${botPosition}\` places higher than my highest role`}**`);
        }
        if (role.managed) {
            return message.responder.error('**Unable to give integrated bot roles**');
        }
        member.roles.add(role.id).then(() => {
            return message.util.send({
                embed: this.client.util.embed()
                    .setTitle(`${emotes.success} Role given`)
                    .setThumbnail(this.client.avatar)
                    .setColor(this.client.color)
                    .setDescription(`The role **${role.name}** has been given to \`${member.user.tag}\``)
            })
        }).catch((error) => {
            return message.responder.error(`**Encountered an error**: \`${error}\``);
        })
    }
}