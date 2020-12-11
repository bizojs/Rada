const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class AvatarCommand extends Command {
    constructor() {
        super('avatar', {
          aliases: ['avatar', 'av'],
          category: 'Miscellaneous',
          description: {
            content: 'Get a user\'s avatar.',
            permissions: ['EMBED_LINKS']
          },
          args: [{
            id: 'member',
            type: 'member',
            default: message => message.member
          }],
          clientPermissions: ['EMBED_LINKS']
        });
        this.placeholder = "https://i.br4d.vip/G9SXe-5O.png";
    }

    async exec(message, args) {
      const embed = new MessageEmbed()
        .setColor(this.client.color)
        .setThumbnail(this.client.avatar)
        .setTitle(args.member.id === message.author.id ? 'Your avatar:' : `${args.member.user.tag}'s avatar:`)
        .setImage(args.member.user.avatarURL() ? args.member.user.avatarURL({ size: 512, dynamic: true }).replace(/webm/g, 'gif').replace(/webp/g, 'png') : this.placeholder)
        .setFooter(`Requested by ${message.author.username}`)
        .setTimestamp()
      return message.util.send(embed);
    }
}

module.exports = AvatarCommand;