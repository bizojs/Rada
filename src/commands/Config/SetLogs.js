const { Command, Argument } = require('discord-akairo');
const { emotes } = require('../../../lib/constants');

module.exports = class SetLogsCommand extends Command {
    constructor() {
      super('setlogs', {
        aliases: ['setlogs', 'logs', 'modlogs'],
        category: 'Config',
        description: {
          content: 'Change the current modlog channel',
          permissions: ['EMBED_LINKS']
        },
        args: [{
          id: 'channel',
          type: Argument.union('textChannel', 'string'),
          default: null,
        }],
        userPermissions: ['MANAGE_GUILD'],
        clientPermissions: ['EMBED_LINKS']
      });
    }

    async exec(message, { channel }) {
        let current = message.guild.settings.get(message.guild.id, 'logs', false);
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setFooter(`Requested by ${message.author.username}`)
            .setTimestamp()
        if (!channel) {
            return message.util.send(this.current(message, embed, current));
        }
        if (!channel.id && channel.toLowerCase() !== 'reset') {
            return message.util.send(this.current(message, embed, current));
        }
        if (!channel.id && channel.toLowerCase() === 'reset') {
            await message.guild.settings.set(message.guild.id, 'logs', null);
            embed.addField(`${emotes.success} | Modlogs reset`, 'The modlogs channel has been reset')
            return message.util.send(embed);
        }
        if (channel.id && channel.id === current) {
            embed.addField(`${emotes.error} | Failed`, `The modlogs channel is already \`#${channel.name} (${channel.id})\`...\nTry another channel`)
            return message.util.send(embed);
        }
        await message.guild.settings.set(message.guild.id, 'logs', channel.id);
        embed.addField(`${emotes.success} | Modlogs updated`, `The modlogs channel has been set to \`#${channel.name} (${channel.id})\`\nYou can reset it with \`${message.guild.prefix}setlogs reset\``)
        return message.util.send(embed);
    }
    current(message, embed, current) {
        embed.setTitle(`${this.client.user.username} modlog settings`)
            .setDescription('You can find information about the modlogs below.')
            .addField('Current channel', `${current ? `${message.guild.channels.cache.get(current).name}` : 'Not set'}`)
            .addField('Update channel', `\`${message.guild.prefix}setlogs <#channel>\``)
        return embed;
    }
}
