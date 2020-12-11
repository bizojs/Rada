const { Command } = require('discord-akairo');

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
        userPermissions: ['BAN_MEMBERS'],
        clientPermissions: ['BAN_MEMBERS']
      });
    }

    async exec(message, { id }) {
        if (!id) {
            return message.responder.error('**Please provide a valid ID to unban**');
        }
        try {
            let fetched = await this.client.users.fetch(id);
            let user = this.client.users.cache.get(fetched.id);
            const bans = await message.guild.fetchBans();
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