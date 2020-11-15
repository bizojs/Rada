const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const req = require('@aero/centra');

class ServerInfoCommand extends Command {
    constructor() {
        super('serverinfo', {
           aliases: ['serverinfo', 'si'],
           category: 'Miscellaneous',
           description: 'Get information about the server',
        });
        this.regions = {
          'eu-central': 'Central Europe',
          india: 'India',
          london: 'London',
          japan: 'Japan',
          amsterdam: 'Amsterdam',
          brazil: 'Brazil',
          'us-west': 'US West',
          hongkong: 'Hong Kong',
          southafrica: 'South Africa',
          sydney: 'Sydney',
          europe: 'Europe',
          singapore: 'Singapore',
          'us-central': 'US Central',
          'eu-west': 'Western Europe',
          dubai: 'Dubai',
          'us-south': 'US South',
          'us-east': 'US East',
          frankfurt: 'Frankfurt',
          russia: 'Russia'
        };
        this.mfaLevel = {
            0: 'None',
            1: 'Elevated'
        };
    }

    async exec(message) {
      let information = [
        `This guild has a total of **${message.guild.memberCount.toLocaleString()}** members which consists of \`${message.guild.members.cache.filter(member => !member.user.bot).size.toLocaleString()} members and ${message.guild.members.cache.filter(member => member.user.bot).size.toLocaleString()} bots\``,
        `This guild has a total of **${message.guild.channels.cache.size.toLocaleString()}** channels which consists of \`${message.guild.channels.cache.filter(c => c.type === 'text').size.toLocaleString()} text, ${message.guild.channels.cache.filter(c => c.type === 'voice').size.toLocaleString()} voice and ${message.guild.channels.cache.filter(c => c.type === 'category').size.toLocaleString()} categories\``,
        `This guild has a total of **${message.guild.emojis.cache.size}** emotes which consists of \`${message.guild.emojis.cache.filter(e => !e.animated).size.toLocaleString()} static and ${message.guild.emojis.cache.filter(e => e.animated).size.toLocaleString()} animated\``,
        `This guild has a total of **${message.guild.roles.cache.size.toLocaleString()}** roles`
      ]
      let information2 = [
        `${message.guild.memberCount.toLocaleString()} total members \`[${message.guild.members.cache.filter(member => !member.user.bot).size.toLocaleString()} members, ${message.guild.members.cache.filter(member => member.user.bot).size.toLocaleString()} bots]\``,
        `${message.guild.channels.cache.size.toLocaleString()} total channels \`[${message.guild.channels.cache.filter(c => c.type === 'text').size.toLocaleString()} text, ${message.guild.channels.cache.filter(c => c.type === 'voice').size.toLocaleString()} voice, ${message.guild.channels.cache.filter(c => c.type === 'category').size.toLocaleString()} categories]\``,
        `${message.guild.emojis.cache.size} total emotes \`[${message.guild.emojis.cache.filter(e => !e.animated).size.toLocaleString()} static, ${message.guild.emojis.cache.filter(e => e.animated).size.toLocaleString()} animated]\``,
        `${message.guild.roles.cache.size.toLocaleString()} total roles`
      ]
      let embed = new MessageEmbed()
          .setColor(this.client.color)
          .setFooter(message.author.username)
          .setTimestamp()
          .setTitle(`Server information for **${message.guild.name}**`)
          .addField(`• Owner`, `${message.guild.owner} [${message.guild.owner.id}]\nAccount created on ${this.client.timeFormat('dddd d MMMM YYYY', message.guild.owner.user.createdAt, true)}`)
          .addField(`• Information`, `Guild created on ${this.client.timeFormat('dddd d MMMM YYYY', message.guild.createdAt, true)}\n${information2.join('\n')}`)
          .addField(`• Details`, `Region: **${this.regions[message.guild.region]}**\nNotifications: **${message.guild.defaultMessageNotifications.toLowerCase()}**\nVerification level: **${message.guild.verificationLevel.toLowerCase()}**\nExplicit content filter: **${message.guild.explicitContentFilter.toLowerCase()}**\nMfa level: **${this.mfaLevel[message.guild.mfaLevel]}**`)
          .addField(`• Boost`, `This guild has ${message.guild.premiumSubscriptionCount > 1 ? `**${message.guild.premiumSubscriptionCount}** boosts. [\`${message.guild.settings.get('prefix')}boostinfo\`]` : 'no boosts'}${message.guild.features.length > 0 ? `\nFeatures: **${message.guild.features.toString().replace(/_/g, ' ').split(',').join(', ').toLowerCase()}**` : ''}${message.guild.splashURL() !== null ? `\nInvite splash: **[View here](${message.guild.splashURL({ size: 1024, format: 'png' })})**` : ''}${message.guild.vanityURLCode !== null ? `Vanity url: https://discord.gg/${message.guild.vanityURLCode}` : ''}`)
      if (message.guild.iconURL() !== null) {
          embed.setThumbnail(message.guild.iconURL({size:512}).replace(/webm/g, 'gif').replace(/webp/g, 'png'))
      }
      if (message.guild.description !== null) {
          embed.setDescription(message.guild.description)
      }
      return message.channel.send(embed);
    }
}

module.exports = ServerInfoCommand;