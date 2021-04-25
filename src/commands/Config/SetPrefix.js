const { Command } = require('discord-akairo');
const { emotes } = require('../../../lib/constants');
const RadaAPIEvents = require('../../../lib/api/RadaAPI').EventManager;
const RadaAPIPrefixEvent = require('../../../lib/api/common/Structures').RadaAPIPrefixEvent;
module.exports = class SetPrefixCommand extends Command {
    constructor() {
      super('setprefix', {
        aliases: ['setprefix'],
        category: 'Config',
        description: {
          content: 'Change the current prefix of Rada',
          permissions: ['EMBED_LINKS']
        },
        args: [{
          id: 'prefix',
          type: 'string',
          default: null,
        }],
        userPermissions: ['MANAGE_GUILD'],
        clientPermissions: ['EMBED_LINKS']
      });
    }

    async exec(message, { prefix }) {
        let current = this.client.settings.get(message.guild.id, 'prefix', this.client.defaultPrefix);
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setFooter(`Requested by ${message.author.username}`)
            .setTimestamp()
        if (!prefix) {
            return message.util.send(this.current(message, embed));
        }
        if (prefix.toLowerCase() === 'reset') {
            RadaAPIEvents.emit('prefix', new RadaAPIPrefixEvent(message.guild.prefix, this.client.defaultPrefix, message.member, message.guild))
            await this.client.settings.set(message.guild.id, 'prefix', this.client.defaultPrefiiox);
            embed.addField(`${emotes.success} | Prefix reset`, `The prefix has been reset to \`${this.client.defaultPrefix}\``)
            return message.util.send(embed);
        }
        if (prefix === current) {
            embed.addField(`${emotes.error} | Failed`, `The prefix is already \`${prefix}\`... Try something different`)
            return message.util.send(embed);
        }
        if (prefix.length > 6) {
            embed.addField(`${emotes.error} | Failed`, 'The prefix can\'t be longer than 6 characters')
            return message.util.send(embed);
        }
        RadaAPIEvents.emit('prefix', new RadaAPIPrefixEvent(message.guild.prefix, prefix, message.member, message.guild))
        await this.client.settings.set(message.guild.id, 'prefix', prefix);
        embed.addField(`${emotes.success} | Prefix updated`, `The prefix has been set to \`${prefix}\`\nYou can change it back with \`${prefix}setprefix reset\``)
        return message.util.send(embed);
    }
    current(message, embed) {
        embed.setTitle(`${this.client.user.username} prefix settings`)
            .setDescription('You can find information about the prefix below.')
            .addField('Current prefix', `\`${message.guild.prefix}\``)
            .addField('Update prefix', `\`${message.guild.prefix}setprefix <new_prefix>\``)
        return embed;
    }
}
