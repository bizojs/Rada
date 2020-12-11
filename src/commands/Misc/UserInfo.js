const { Command } = require('discord-akairo');
const { trimString } = require('../../../lib/util');
const Util = require('../../../lib/structures/Util');

class UserInfoCommand extends Command {
    constructor() {
        super('userinfo', {
            aliases: ['userinfo', 'ui'],
            category: 'Miscellaneous',
            description: {
              content: 'Get information about a user',
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
        let userJoinedAt = `${this.client.timeFormat('dddd d MMMM YYYY', member.joinedAt, true)}`;
        let userCreatedAt = `${this.client.timeFormat('dddd d MMMM YYYY', member.user.createdAt, true)}`;
        let userLastMessage;
        if ([undefined, null].includes(member.lastMessage)) {
            userLastMessage = "Last message not found";
        } else { userLastMessage = trimString(member.lastMessage, 30); }
        let flags = [];
        for (const flag of member.user.flags.toArray()) {
            flags.push(Util.toTitleCase(flag.replace(/_/g, ' ')))
        }
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setTitle(`${member.user.tag} User Information`)
            .addField(`• Stats`, `Account created on ${userCreatedAt}\nJoined ${message.guild.name} on ${userJoinedAt}`)
            .addField(`• Information`, `Nickname: ${member.nickname !== null ? `**${member.nickname}**` : '**None**'}\nBannable: ${member.bannable ? '**Yes**' : '**No**'}\nKickable: ${member.kickable ? '**Yes**' : '**No**'}\nBot: ${member.user.bot ? '**Yes**' : '**No**'}\nCustom status: ${member.user.presence.activity && member.user.presence.activity.type === 'CUSTOM_STATUS' ? `${member.user.presence.activity.emoji ? member.user.presence.activity.emoji : ''} ${member.user.presence.activity.state !== null ? `\`${member.user.presence.activity.state}\`` : ''}` : 'No custom status'}\nLast Message: ${userLastMessage}`)
            .addField(`• Highest Role [${member.roles.highest.position}/${message.guild.roles.highest.position}]`, `${member.roles.highest} \`[${member.roles.highest.id}]\``)
            .setFooter(`Requested by ${message.author.username}`)
            .setTimestamp()
        if (member.user.avatarURL() !== null) {
            embed.setThumbnail(member.user.avatarURL({size:512}).replace(/webp/g, 'png').replace(/web?m/g, 'gif'))
        }
        if (flags.length > 1) {
            embed.addField('Badges', flags.join(', '))
        }
        return message.util.send(embed);        
    }
}

module.exports = UserInfoCommand;
