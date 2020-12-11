const { Command } = require('discord-akairo');
const req = require('@aero/centra');

class RoleColorCommand extends Command {
    constructor() {
        super('rolecolor', {
            aliases: ['rolecolor', 'rc'],
            category: 'Miscellaneous',
            description: {
              content: 'Get information about a role\'s color',
              permissions: ['EMBED_LINKS']  
            },
            args: [{
                id: 'role',
                type: 'role',
                default: message => message.member.roles.highest
            }],
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec(message, args) {
      let role = args.role;
      let hex = role.hexColor.replace(/#/g, "");
      const data = await req(`https://api.alexflipnote.dev/color/${hex}`).json();
      return message.util.send({ embed: this.client.util.embed()
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