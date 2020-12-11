const { Command } = require('discord-akairo');

class InviteStatsCommand extends Command {
    constructor() {
        super('invitestats', {
          aliases: ['invitestats', 'is'],
          category: 'Miscellaneous',
          description: {
            content: 'Shows the amount of uses from each invite created in your server.',
            permissions: ['EMBED_LINKS']
          },
          clientPermissions: ['EMBED_LINKS']
      });
    }

    async exec(message) {
      let embed = this.client.util.embed()
        .setTitle(`${message.guild.name} invite stats`)
        .setColor(this.client.color)
        .setThumbnail(this.client.avatar)
        .setFooter(`Requested by ${message.author.username}`)
        .setTimestamp()

      let possible = []
      let invites = await message.guild.fetchInvites()
      .then(invites => {
        invites.forEach(invite => {
          // Ternary operators make life so much easier 👌
          possible.push(`\`[${invite.code}]\` Inviter: **${invite.inviter.tag}** - Uses: **${invite.uses === 1 ? `${invite.uses} use` : `${invite.uses} uses`}** - ${invite.channel.type === 'voice' ? 'VC' : 'TC'}: ${invite.channel.type === 'voice' ? `**🔈${invite.channel.name}**` : invite.channel}`)
        })
        embed.setDescription(possible.length > 0 ? possible : 'There are no invites in this server')
        return message.util.send(embed);
      })
      .catch(error => {
        embed.addField('Encountered an error', `\`${error.message}\``)
        return message.util.send(embed);
      });
    }
}

module.exports = InviteStatsCommand;