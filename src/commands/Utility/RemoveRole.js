const { Command } = require('discord-akairo');
const { emotes } = require('../../../lib/constants');

module.exports = class GiveRoleCommand extends Command {
    constructor() {
        super('removerole', {
            aliases: ['removerole', 'rr'],
            category: 'Utility',
            description: {
                content: 'Remove a role from a user',
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
            return message.responder.error(`**Please provide a user to remove a role from**`);
        }
        if (!role) {
            return message.responder.error(`**Please provide a role to remove from \`${member.user.tag}\`**`);
        }
        if (!member.roles.cache.has(role.id)) {
            return message.responder.error(`\`${member.user.tag}\` doesn't have the role **${role.name}**`);
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
            return message.responder.error('**Unable to remove integrated bot roles**');
        }
        member.roles.remove(role.id).then(() => {
            return message.util.send({
                embed: this.client.util.embed()
                    .setTitle(`${emotes.success} Role removed`)
                    .setThumbnail(this.client.avatar)
                    .setColor(this.client.color)
                    .setDescription(`The role **${role.name}** has been removed from \`${member.user.tag}\``)
            })
        }).catch((error) => {
            return message.responder.error(`**Encountered an error**: \`${error}\``);
        })
    }
}