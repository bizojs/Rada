const { Command } = require('discord-akairo');

class JoinDaysComamnd extends Command {
    constructor() {
        super('joindays', {
            aliases: ['joindays', 'jd', 'joininfo'],
            category: 'Miscellaneous',
            description: {
              content: 'Information about when a user joined the current server and when they created their account.',
              permissions: ['EMBED_LINKS']
            },
            args: [{
                id: 'member',
                type: 'member',
                default: message => message.member
            }],
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec(message, args) {
      let member = args.member;     
      const embed = this.client.util.embed()
        .setColor(this.client.color)
        .setThumbnail(this.client.avatar)
        .addField(`Member join info: ${member.user.username}`, `For full member info, run \`${message.guild.prefix}userinfo ${member.user.tag}\`.`)
        .addField(`:inbox_tray: Joined Server`, this.client.timeFormat('dddd d MMMM YYYY', member.joinedAt), true)
        .addField(`:calendar: Joined Discord`, this.client.timeFormat('dddd d MMMM YYYY', member.user.createdAt), true)
        .setFooter(`Requested by ${message.author.username}`)
        .setTimestamp()
      return message.util.send(embed);
    }
}

module.exports = JoinDaysComamnd;