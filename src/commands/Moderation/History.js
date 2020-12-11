const { Command } = require('discord-akairo');

module.exports = class HistoryCommand extends Command {
    constructor() {
        super('history', {
            aliases: ['history', 'ads'],
            category: 'Moderation',
            description: {
                content: 'See how many links/advertisements a user has sent (will only count the links if the antilink is turned on)',
                permissions: ['EMBED_LINKS']
            },
            args: [{
                id: 'member',
                type: 'member',
                default: message => message.member,
                unordered: true
            },
            {
                id: 'clear',
                type: 'lowercase',
                default: null,
                unordered: true
            }],
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec(message, { member, clear }) {
        if (!clear) {
            return message.util.send(this.display(member));
        } else {
            if (['clear', 'reset'].some(option => clear === option || member === option)) {
                if (!message.member.permissions.has('MANAGE_MESSAGES')) {
                    return message.responder.error('**To clear advertising history, you require the ability to manage messages**');
                }
                if (member.settings.get(member.id, 'history', 0) === 0) {
                    return message.responder.error(`**\`${member.user.tag}\` has no history to clear**`);
                }
                await member.settings.reset(member.id, 'history');
                return message.responder.success(`**The advertising history for \`${member.user.tag}\` has been reset**`);
            } else {
                return message.util.send(this.display(member));
            }
        }
    }
    display(member) {
        let history = member.settings.get(member.id, 'history', 0);
        let days = this.client.daysBetween(member.joinedAt).toFixed(0);
        let embed = this.client.util.embed()
            .setTitle(`Advertisement history for ${member.user.username}`)
            .setColor(this.client.color)
            .setThumbnail(member.user.avatarURL({size: 512}).replace('webp', 'png').replace('webm', 'gif'))
            .setDescription(`📝 \`${member.user.tag}\` has sent a total of \`${history}\` ads${history > 0 ? ` within **${days} day${days !== 1 ? 's' : ''}** of joining` : ''}`)
            .setTimestamp()
        return embed;
    } 
}
