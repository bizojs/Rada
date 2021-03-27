const { Command } = require('discord-akairo');

module.exports = class DataCommand extends Command {
    constructor() {
      super('data', {
        aliases: ['data'],
        category: 'Config',
        description: {
          content: 'Clear your own member/guild data from the database',
          permissions: ['EMBED_LINKS']
        },
        args: [
            {
                id: 'option',
                type: 'string',
                default: null,
            }, {
                id: 'guild',
                match: 'flag',
                flag: '--guild',
            }
        ],
        userPermissions: ['MANAGE_GUILD'],
        clientPermissions: ['EMBED_LINKS']
      });
    }

    async exec(message, { option, guild }) {
        if (!option || option.toLowerCase() !== 'clear') {
            return message.responder.error(`To clear your data, use \`${message.guild.prefix}data clear\`\nTo clear the guild data, use \`${message.guild.prefix}data clear --guild\``)
        }
        if (!guild) {
            await message.member.settings.clear(message.author.id);
            return message.responder.success('Your user/member data has been cleared');
        } else {
            if (message.guild.ownerID !== message.author.id) {
                return message.responder.error('You must be the guild owner to use this');
            }
            await message.guild.settings.clear(message.guild.id);
            return message.responder.success(`The **${message.guild.name}** guild data has been cleared`);
        }
    }
}
