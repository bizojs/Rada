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
                userLastMessage = 'Last message not found';
            } else { userLastMessage = `[${trimString(member.lastMessage, 30)}](${member.lastMessage.jumplink})`; }
            let embed = this.client.util.embed()
                .setColor(this.client.color)
                .setTitle(`${member.user.tag} User Information`)
                .addField(`• Stats`, `Account created on ${userCreatedAt}\nJoined ${message.guild.name} on ${userJoinedAt}`)
                .addField(`• Information`, `${member.nickname !== null ? `${message.emotes.checked} Nickname: **${member.nickname}**` : `${message.emotes.unchecked} Nickname: **None**`}\n${[undefined, null].includes(member.lastMessage) ? message.emotes.unchecked : message.emotes.checked} Last Message: ${userLastMessage}\n${member.bannable ? message.emotes.checked : message.emotes.unchecked} Bannable\n${member.kickable ? message.emotes.checked : message.emotes.unchecked} Kickable\n${member.user.bot ? message.emotes.checked : message.emotes.unchecked} Bot`)
            .addField(`• Highest Role [${member.roles.highest.position}/${message.guild.roles.highest.position}]`, `${member.roles.highest} \`[${member.roles.highest.id}]\``)
            .setFooter(`Requested by ${message.author.username}`)
            .setTimestamp()
        if (member.user.avatarURL() !== null) {
            embed.setThumbnail(member.user.avatarURL({size:512, dynamic: true}).replace(/webp/g, 'png').replace(/webm/g, 'gif'))
        }
        if (member.user.displayFlags().length > 0) {
            embed.addField('Badges', member.user.displayFlags())
        }
        return message.util.send(embed);        
    }
}

module.exports = UserInfoCommand;