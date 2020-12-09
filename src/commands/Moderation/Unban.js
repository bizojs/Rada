const { Command } = require('discord-akairo');
const { production, prefix, devPrefix } = require('../../config');

module.exports = class UnbanCommand extends Command {
    constructor() {
      super('unban', {
        aliases: ['unban', 'ub'],
        category: 'Moderation',
        description: {
            content: 'Unban a user from the server.',
            permissions: ['BAN_MEMBERS']
        },
        args: [{
          id: 'id',
          type: 'string',
          default: null
        }],
      });
    }
    userPermissions(message) {
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.responder.error('**You require the ban members permission to use this command**');
        }
        return null;
    }
    clientPermissions(message) {
        if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
            return message.responder.error('**I require the ban members permission to use this command**');
        }
        return null;
    }

    async exec(message, { id }) {
        if (!id) {
            return message.responder.error('**Please provide a valid ID to unban**');
        }
        try {
            let fetched = await this.client.users.fetch(id);
            let user = this.client.users.cache.get(fetched.id);
            const bans = await message.guild.fetchBans();
            if (message.guild.members.cache.has(user.id)) {
                return message.responder.error(`**That user is already in the server**. Instead you can use \`${message.guild.prefix}ban ${user.tag}\``);
            }
            if (!bans.has(user.id)) {
                return message.responder.error('**That user is not banned**');
            }
            message.guild.members.unban(user.id)
            .then(member => {
                return message.responder.success(`\`${member.tag} (${member.id})\` has been unbanned`)
            })
            .catch(e => {
                return message.responder.error(e.message);
            })
        } catch (e) {
            return message.responder.error(`A user with the id of \`${id}\` was not found`);
        }
    }
}