const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const req = require('@aero/centra');

class SettingsCommand extends Command {
    constructor() {
      super('settings', {
        aliases: ['settings', 'config'],
        category: 'Config',
        description: 'Edit the various setting configurations available',
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
        userPermissions: ['MANAGE_GUILD'],
      });
    }

    async exec(message, args) {
      let embed = new MessageEmbed()
        .setColor(this.client.color)
        .setFooter(`Requested by ${message.author.tag}`)
        .setTimestamp()
      if (!args.option) {
        embed.setTitle(`${this.client.user.username} settings`)
             .setDescription(`You will find any available settings below\nYou can update one of the settings with \`${this.client.settings.get(message.guild.id, 'prefix')}settings (option) (value)\``)
             .addField('Prefix', `\`${this.client.settings.get(message.guild.id, 'prefix')}\``)
             .addField('Welcome channel', `${this.client.settings.get(message.guild.id, 'wc', 'None') !== 'None' ? `${message.guild.channels.cache.get(this.client.settings.get(message.guild.id, 'wc'))} \`(${this.client.settings.get(message.guild.id, 'wc')})\`` : '\`None\`'}`)
             .addField('Join Message', `${this.client.settings.get(message.guild.id, 'jm', 'None') !== 'None' ? `${this.client.settings.get(message.guild.id, 'jm')}` : '\`None\`'}`)
             .addField('Leave Message', `${this.client.settings.get(message.guild.id, 'lm', 'None') !== 'None' ? `${this.client.settings.get(message.guild.id, 'lm')}` : '\`None\`'}`)
        return message.channel.send(embed);
        if (!args.prefix) {
          embed.addField('Prefix', `\`${this.client.settings.get(message.guild.id, 'prefix')}\``)
          return message.channel.send(embed);
        }
      }
      if (args.option === 'prefix') {
        let newPrefix = message.util.parsed.content.replace('prefix ', '');
        if (newPrefix.length < 1) {
          embed.setTitle(`Prefix`)
               .setDescription(`Update the prefix with \`${this.client.settings.get(message.guild.id, 'prefix')}settings prefix new_prefix\``)
               .addField('Current prefix', `\`${this.client.settings.get(message.guild.id, 'prefix')}\``);
          return message.channel.send(embed);
        }
        if (newPrefix > 6) return message.channel.send(`❌ **Your prefix can\'t be longer than 6 characters**`);
        await this.client.settings.set(message.guild.id, 'prefix', newPrefix);
        embed.setTitle(`Prefix updated`)
             .setDescription(`✅ **Your prefix has been updated to** \`${newPrefix}\``)
        return message.channel.send(embed);
      }
      if (args.option === 'wc') {
        if (!args.prefix) {
          embed.setTitle(`Welcome Channel`)
               .setDescription(`Update the welcome channel with \`${this.client.settings.get(message.guild.id, 'prefix')}settings wc #channel\``)
               .addField('Current channel', `${this.client.settings.get(message.guild.id, 'jm', 'None') !== 'None' ? `${message.guild.channels.cache.get(this.client.settings.get(message.guild.id, 'wc'))} \`(${this.client.settings.get(message.guild.id, 'wc')})\`` : '\`None\`'}`);
          return message.channel.send(embed);
        }
        await this.client.settings.set(message.guild.id, 'wc', args.channel.id);
        embed.setTitle(`Welcome channel updated`)
             .setDescription(`✅ **The welcome channel has been set to** ${args.channel} \`(${args.channel.id})\``)
        return message.channel.send(embed);
      }
      if (args.option === 'jm') {
        let msg = message.util.parsed.content.replace('jm', '');
        let placeholders = [
          '{user} - The mention of the user',
          '{tag} - The user#discrim of the user',
          '{username} - The username of the user',
          '{servername} - The name of the server',
          '{membercount} - Member count of the server'
        ]
        if (msg.length < 1) {
          embed.setTitle(`Join Message`)
               .setDescription(`Update the join message with \`${this.client.settings.get(message.guild.id, 'prefix')}settings jm message\``)
               .addField('Current message', `\`${this.client.settings.get(message.guild.id, 'jm', 'None')}\``)
               .addField('Placeholders', placeholders);
          return message.channel.send(embed);
        }
        await this.client.settings.set(message.guild.id, 'jm', msg);
        embed.setTitle(`Join message updated`)
             .setDescription(`✅ **Your join message has been updated to**\n\`\`\`${msg}\`\`\``)
        return message.channel.send(embed);
      }
      if (args.option === 'lm') {
        let msg = message.util.parsed.content.replace('lm', '');
        let placeholders = [
          '{user} - The mention of the user',
          '{tag} - The user#discrim of the user',
          '{username} - The username of the user',
          '{servername} - The name of the server',
          '{membercount} - Member count of the server'
        ]
        if (msg.length < 1) {
          embed.setTitle(`Leave Message`)
               .setDescription(`Update the leave message with \`${this.client.settings.get(message.guild.id, 'prefix')}settings lm message\``)
               .addField('Current message', `\`${this.client.settings.get(message.guild.id, 'lm', 'None')}\``)
               .addField('Placeholders', placeholders);
          return message.channel.send(embed);
        }
        await this.client.settings.set(message.guild.id, 'lm', msg);
        embed.setTitle(`Leave message updated`)
             .setDescription(`✅ **Your leave message has been updated to**\n\`\`\`${msg}\`\`\``)
        return message.channel.send(embed);
      }
    }
}

module.exports = SettingsCommand;