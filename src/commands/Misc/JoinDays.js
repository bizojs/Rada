const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const config = require('../../../src/config');

class JoinDaysComamnd extends Command {
    constructor() {
        super('joindays', {
           aliases: ['joindays', 'jd', 'joininfo'],
           category: 'Miscellaneous',
           description: 'Information about when a user joined the current server and when they created their account.',
           args: [{
              id: 'member',
              type: 'member',
              default: message => message.member
           }]
        });
    }

    async exec(message, args) {
      let member = args.member;     
      const embed = new MessageEmbed()
        .setColor(this.client.color)
        .setThumbnail(this.client.avatar)
        .addField(`Member join info: ${member.user.username}`, `For full member info, run \`${this.client.settings.get(message.guild.id, 'prefix', config.production ? config.prefix : config.devPrefix)}userinfo ${member.user.tag}\`.`)
        .addField(`:inbox_tray: Joined Server`, this.client.timeFormat('dddd d MMMM YYYY', member.joinedAt), true)
        .addField(`:calendar: Joined Discord`, this.client.timeFormat('dddd d MMMM YYYY', member.user.createdAt), true)
        .setFooter(`Requested by ${message.author.username}`)
        .setTimestamp()
      return message.channel.send(embed);
    }
}

module.exports = JoinDaysComamnd;