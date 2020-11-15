const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const req = require('@aero/centra');

class RoleColorCommand extends Command {
    constructor() {
        super('rolecolor', {
           aliases: ['rolecolor', 'rc'],
           category: 'Miscellaneous',
           description: 'Get information about a role\'s color',
           args: [{
              id: 'role',
              type: 'role',
              default: message => message.member.roles.highest
           }]
        });
    }

    async exec(message, args) {
      let role = args.role;
      let hex = role.hexColor.replace(/#/g, "");
      const data = await req(`https://api.alexflipnote.dev/color/${hex}`).json();
      return message.channel.send({ embed: new MessageEmbed()
          .setTitle(`**${role.name}** role color`)
          .setDescription(`Hex Code: ${data.hex}\nName: ${data.name}`)
          .setColor(`${role.hexColor}`)
          .setThumbnail(this.client.avatar)
          .setImage(`${data.image}`)
          .setFooter(`Requested by ${message.author.username}`)
          .setTimestamp()
      })
    }
}

module.exports = RoleColorCommand;