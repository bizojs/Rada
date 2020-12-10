const { Command } = require('discord-akairo');

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
      let embed = this.client.util.embed()
        .setColor(this.client.color)
        .setThumbnail(this.client.avatar)
        .setFooter(`Requested by ${message.author.username}`)
        .setTimestamp()
      if (!args.option) {
        embed.setTitle(`${this.client.user.username} settings`)
             .setDescription(`You will find any available settings below\nYou can update one of the settings with \`${message.guild.prefix}settings (option) (value)\``)
             .addField('Prefix', `\`${message.guild.prefix}\``, true)
             .addField('Logs', `${message.guild.settings.get(message.guild.id, 'logs', 'None') !== 'None' ? `${message.guild.channels.cache.get(message.guild.settings.get(message.guild.id, 'logs'))}` : '\`None\`'}`, true)
             .addField('Antilink', `\`${message.guild.settings.get(message.guild.id, 'antilink', 'None') !== 'None' ? 'Enabled' : 'Disabled'}\``, true)
        return message.util.send(embed);
      }
      if (args.option === 'prefix') {
        let newPrefix = message.util.parsed.content.replace('prefix ', '');
        if (newPrefix.length < 1) {
          embed.setTitle(`Prefix`)
               .setDescription(`Update the prefix with \`${message.guild.prefix}settings prefix new_prefix\``)
               .addField('Current prefix', `\`${message.guild.prefix}\``);
          return message.util.send(embed);
        }
        if (newPrefix > 6) return message.util.send(`❌ **Your prefix can\'t be longer than 6 characters**`);
        await this.client.settings.set(message.guild.id, 'prefix', newPrefix);
        embed.setTitle(`Prefix updated`)
             .setDescription(`✅ **Your prefix has been updated to** \`${message.guild.prefix}\`\n\nYou can change it back with \`${newPrefix}settings prefix ${message.guild.prefix}\``)
        return message.util.send(embed);
      }
      if (args.option === 'logs') {
        if (!args.channel) {
          embed.setTitle(`Logs`)
               .setDescription(`Update the logs channel with \`${message.guild.prefix}settings logs #channel\``)
               .addField('Current channel', `${message.guild.settings.get(message.guild.id, 'logs', 'None') !== 'None' ? `${message.guild.channels.cache.get(message.guild.settings.get(message.guild.id, 'logs'))} \`(${message.guild.settings.get(message.guild.id, 'logs')})\`` : '\`None\`'}`);
          return message.util.send(embed);
        }
        if (!args.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) {
          return message.responder.error(`**For me to use \`#${args.channel.name}\` as the log channel, I must have permission to send messages there.**`);
        }
        await message.guild.settings.set(message.guild.id, 'logs', args.channel.id);
        embed.setTitle(`Logs channel updated`)
            .setDescription(`✅ **The logs channel has been set to** ${args.channel} \`(${args.channel.id})\``)
        return message.util.send(embed);
      }
      if (args.option === 'antilink') {
        let newValue = message.util.parsed.content.replace('antilink', '');
        if (newValue.length < 1) {
          embed.setTitle('Antilink')
               .setDescription(`Update the antilink with \`${message.guild.prefix}settings antilink on/off\`\nAny roles in the guild that include the word \`bypass\` will be ignored by the antilink`)
               .addField('Current setting', `\`${message.guild.settings.get(message.guild.id, 'antilink', 'None') !== 'None' ? `Enabled` : 'Disabled'}\``);
          return message.util.send(embed);
        }
        let newValue2 = newValue.split(' ')[1];
        if (!['on', 'off', 'enable', 'disable'].includes(newValue2.toLowerCase())) {
          return message.responder.error('**Please specify if you are turning the antilink on or off**');
        }
        if (!message.guild.me.permissions.has('MANAGE_MESSAGES')) {
          return message.responder.error('**I require the manage messages permission for the antilink to work**');
        }
        if (['on', 'enable'].includes(newValue2.toLowerCase())) {
          await message.guild.settings.set(message.guild.id, 'antilink', true);
          embed.setTitle(`Antilink updated`)
               .setDescription('✅ **The antilink has been turned** \`on\`')
          return message.util.send(embed);
        }
        if (['off', 'disable'].includes(newValue2.toLowerCase())) {
          await message.guild.settings.set(message.guild.id, 'antilink', 'None');
          embed.setTitle(`Antilink updated`)
               .setDescription('✅ **The antilink has been turned** \`off\`')
          return message.util.send(embed);
        }
      }
    }
}

module.exports = SettingsCommand;