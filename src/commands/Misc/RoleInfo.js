const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const req = require('@aero/centra');

class RoleInfoCommand extends Command {
    constructor() {
        super('roleinfo', {
           aliases: ['roleinfo', 'ri'],
           category: 'Miscellaneous',
           description: 'Get information about a role',
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
      const data = await req(`https://api.alexflipnote.dev/color/${hex}`).json()
      return message.channel.send({ embed: new MessageEmbed()
            .setThumbnail(this.client.avatar)
            .setColor(`${role.hexColor !== '#000000' ? role.hexColor : this.client.color}`)
            .setTitle(`**${role.name}** role info`)
            .setDescription(`Id: \`${role.id}\`\nColor: [${data.name}](${data.image})\nHex: \`${role.hexColor}\`\nRole users: \`${role.members.size}\`\nRole position: \`${role.position}/${message.guild.roles.highest.position}\`\n${role.mentionable ? '✅' : '❎'} Mentionable\n${role.hoist ? '✅' : '❎'} Hoisted\n${role.managed ? '✅' : '❎'} Managed`)
            .addField(`**Created:**`, `\`${new Date(role.createdAt).toLocaleString()} | ${this.client.daysBetween(role.createdAt).toFixed(0)} days ago\``)
          .setFooter(`Requested by ${message.author.username}`)
          .setTimestamp()
      })
    }
}

module.exports = RoleInfoCommand;