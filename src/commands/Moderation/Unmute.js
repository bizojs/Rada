const { Command } = require('discord-akairo');

module.exports = class UnmuteCommand extends Command {
    constructor() {
      super('unmute', {
        aliases: ['unmute', 'um'],
        category: 'Moderation',
        description: {
            content: 'Unmute a user.',
            permissions: ['MUTE_MEMBERS', 'MANAGE_ROLES']
        },
        args: [{
          id: 'member',
          type: 'member',
          default: null
        }],
      });
    }
    userPermissions(message) {
        if (!message.member.permissions.has('MUTE_MEMBERS')) {
            return message.responder.error('**You require the mute members permission to use this command**');
        }
        return null;
    }
    clientPermissions(message) {
        if (!message.guild.me.permissions.has('MANAGE_ROLES')) {
            return message.responder.error('**I require the manage roles permission to use this command**');
        }
        return null;
    }

    async exec(message, { member }) {
        if (!member) {
            return message.responder.error('**Please provide a user to mute**');
        }
        let muteRole = message.guild.roles.cache.find(r => r.name.toLowerCase().includes('muted'));
        if (member.id === message.author.id) {
            return message.responder.error('**You can\'t mute yourself**');
        }
        if (muteRole && message.guild.me.roles.highest.position > message.guild.roles.cache.get(muteRole.id).position < 0) {
            return message.responder.error('**The mute role must be lower than my role**');
        }
        if (muteRole && !member.roles.cache.has(muteRole.id)) {
            return message.responder.error(`**\`${member.user.tag} (${member.id})\` is not muted**`);
        }
        try {
            await member.roles.remove(muteRole.id);
            return message.responder.success(`**\`${member.user.tag} (${member.id})\` has been unmuted**`);
        } catch (e) {
            return message.responder.error(`**Failed to unmute \`${member.user.tag} (${member.id})\`** - ${e.message}`);
        }
    }
}