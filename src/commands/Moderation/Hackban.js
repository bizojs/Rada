const { Command } = require('discord-akairo');

module.exports = class HackbanCommand extends Command {
    constructor() {
      super('hackban', {
        aliases: ['hackban', 'hb'],
        category: 'Moderation',
        description: {
            content: 'Bans a user from the server without them needing to be in the server.',
            permissions: ['BAN_MEMBERS']
        },
        args: [{
            id: 'id',
            type: 'string',
            default: null
        }, {
            id: 'reason',
            type: 'string',
            match: 'rest',
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

    async exec(message, { id, reason }) {
        if (!id) {
            return message.responder.error('**Please provide a valid ID to hackban**');
        }
        try {
            let fetched = await this.client.users.fetch(id);
            let user = this.client.users.cache.get(fetched.id);
            const bans = await message.guild.fetchBans();
            if (message.guild.members.cache.has(user.id)) {
                return message.responder.error(`**That user is already in the server**. Instead you can use \`${message.guild.prefix}ban ${user.tag}\``);
            }
            if (bans.has(user.id)) {
                return message.responder.error('**That user is already banned**');
            }
            message.guild.members.ban(user.id, { reason: `Hackbanned by: ${message.member.user.tag} - Reason: ${reason ? reason : 'No reason provided'}.` })
            .then(member => {
                return message.responder.success(`\`${member.tag} (${member.id})\` has been hackbanned`)
            })
            .catch(e => {
                return message.responder.error(e.message);
            })
        } catch (e) {
            return message.responder.error(`A user with the id of \`${id}\` was not found`);
        }
    }
}