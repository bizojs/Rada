const { Command } = require('discord-akairo');
const { id } = require('../../../lib/constants');

class InviteCommand extends Command {
  constructor() {
      super('invite', {
          aliases: ['invite', 'inv'],
          category: 'Miscellaneous',
          description: {
              content: 'Get the invite link for the bot.',
              permissions: ['EMBED_LINKS']
          },
          clientPermissions: ['EMBED_LINKS']
      });
      this.invites = {
          admin: `https://discord.com/api/oauth2/authorize?client_id=${id}&permissions=8&scope=bot`,
          utility: `https://discord.com/api/oauth2/authorize?client_id=${id}&permissions=2081279217&scope=bot`,
          mod: `https://discord.com/api/oauth2/authorize?client_id=${id}&permissions=2085481719&scope=bot`,
          basic: `https://discord.com/api/oauth2/authorize?client_id=${id}&permissions=67488833&scope=bot`
      }
  }

  async exec(message) {
    let embed = this.client.util.embed()
        .setTitle(`Invite ${this.client.user.username}`)
        .setColor(this.client.color)
        .setThumbnail(this.client.avatar)
        .setFooter(`Requested by ${message.author.tag}`)
        .setTimestamp()
        .addField('Admin', `To invite the bot with full admin perms, click [here](${this.invites.admin})`)
        .addField('Utility', `To invite the bot with utility perms (no moderation perms), click [here](${this.invites.utility})`)
        .addField('Mod', `To invite the bot with only mod perms, click [here](${this.invites.mod})`)
        .addField('Basic', `To invite the bot with perms for basic functionality (no moderation/utility/management perms), click [here](${this.invites.basic})`)
    return message.util.send(embed);
  }
}

module.exports = InviteCommand;