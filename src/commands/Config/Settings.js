const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { production, prefix, devPrefix } = require('../../config');
const req = require('@aero/centra');

class SettingsCommand extends Command {
    constructor() {
      super('settings', {
        aliases: ['settings', 'config'],
        category: 'Config',
        description: {
          content: 'Edit the various configurations available',
          permissions: ['EMBED_LINKS']
        },
        args: [{
          id: 'option',
          type: 'string',
          default: null
        }, {
          id: 'prefix',
          type: 'string',
          default: null,
          unordered: true
        }, {
          id: 'channel',
          type: 'textChannel',
          default: null,
          unordered: true
        }],
      });
    }
    userPermissions(message) {
      if (!message.member.permissions.has('MANAGE_GUILD')) {
          return message.responder.error('**You require the manage server permission to use this command**');
      }
      return null;
    }

    async exec(message, args) {
      let prefix = this.client.settings.get(message.guild.id, 'prefix', production ? prefix : devPrefix);
      let embed = new MessageEmbed()
        .setColor(this.client.color)
        .setThumbnail(this.client.avatar)
        .setFooter(`Requested by ${message.author.username}`)
        .setTimestamp()
      if (!args.option) {
        embed.setTitle(`${this.client.user.username} settings`)
             .setDescription(`You will find any available settings below\nYou can update one of the settings with \`${prefix}settings (option) (value)\``)
             .addField('Prefix', `\`${prefix}\``, true)
             .addField('Logs', `${message.guild.settings.get(message.guild.id, 'logs', 'None') !== 'None' ? `${message.guild.channels.cache.get(message.guild.settings.get(message.guild.id, 'logs'))}` : '\`None\`'}`, true)
        return message.channel.send(embed);
      }
      if (args.option === 'prefix') {
        let newPrefix = message.util.parsed.content.replace('prefix ', '');
        if (newPrefix.length < 1) {
          embed.setTitle(`Prefix`)
               .setDescription(`Update the prefix with \`${prefix}settings prefix new_prefix\``)
               .addField('Current prefix', `\`${prefix}\``);
          return message.channel.send(embed);
        }
        if (newPrefix > 6) return message.channel.send(`❌ **Your prefix can\'t be longer than 6 characters**`);
        await this.client.settings.set(message.guild.id, 'prefix', newPrefix);
        embed.setTitle(`Prefix updated`)
             .setDescription(`✅ **Your prefix has been updated to** \`${newPrefix}\`\n\nYou can change it back with \`${newPrefix}settings prefix ${prefix}\``)
        return message.channel.send(embed);
      }
      if (args.option === 'logs') {
        if (!args.channel) {
          embed.setTitle(`Logs`)
               .setDescription(`Update the logs channel with \`${prefix}settings logs #channel\``)
               .addField('Current channel', `${message.guild.settings.get(message.guild.id, 'logs', 'None') !== 'None' ? `${message.guild.channels.cache.get(message.guild.settings.get(message.guild.id, 'logs'))} \`(${message.guild.settings.get(message.guild.id, 'logs')})\`` : '\`None\`'}`);
          return message.channel.send(embed);
        }
        await message.guild.settings.set(message.guild.id, 'logs', args.channel.id);
        embed.setTitle(`Logs channel updated`)
            .setDescription(`✅ **The logs channel has been set to** ${args.channel} \`(${args.channel.id})\``)
        return message.channel.send(embed);
      }
    }
}

module.exports = SettingsCommand;