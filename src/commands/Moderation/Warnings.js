const { Command } = require('discord-akairo');

module.exports = class WarningsCommand extends Command {
    constructor() {
        super('warnings', {
            aliases: ['warnings', 'infractions'],
            category: 'Moderation',
            description: {
                content: 'With this command you can View **all** warnings a user has, view a specific warning, delete a specific warning or delete all warnings.\nFind the "Examples" field below',
                examples: (message) => [
                    `\`${message.guild.prefix}warnings <User>\` - View all warnings`,
                    `\`${message.guild.prefix}warnings <User> <ID>\` - View specific warning`,
                    `\`${message.guild.prefix}warnings <User> clear <ID>\` - Clear a specific warning`,
                    `\`${message.guild.prefix}warnings <User> clear all\` - Clear all warnings`,
                ],
                permissions: ['EMBED_MESSAGES']
            },
            args: [
            {
                id: 'member',
                type: 'member',
                default: message => message.member
            },
            {
                id: 'clear',
                type: 'lowercase',
                default: null
            },
            {
                id: 'id',
                type: 'lowercase',
                default: null
            }
            ]
        });
    }

    async exec(message, { member, clear, id }) {
        let warnings = member.settings.get(member.id, 'warnings', [])
        if (clear !== 'clear') {
            if (warnings.length < 1) {
                return message.responder.error(`**\`${member.user.tag}\` has no warnings**`);
            }
            if (clear) {
                if (warnings.filter(warning => warning.id === clear).length < 1) {
                    return message.responder.error(`**The unique warning ID** \`${clear}\` **was not found**`);
                }
                let warning = warnings.filter(warning => warning.id === clear)[0];
                let embed = this.client.util.embed()
                    .setTitle('Warning info')
                    .setColor(this.client.color)
                    .setThumbnail(member.user.avatarURL({size: 512}).replace('webp', 'png').replace('webm', 'gif'))
                    .addField('Unique ID', warning.id)
                    .addField('Issued at', warning.date.toString())
                    .addField('Moderator', warning.moderator)
                    .addField('Warn reason', warning.reason)
                    .setFooter(`Requested by ${message.author.username}`)
                    .setTimestamp()
                return message.util.send(embed);
            }
            let embeds = [];
            let pages = this.client.chunkify(warnings, 5);
            for (let i = 0; i < pages.length; i ++) {
                let embed = this.client.util.embed()
                    .setTitle(`Warnings for ${member.user.username} (${member.settings.get(member.id, 'warnings', []).length} total)`)
                    .setColor(this.client.color)
                    .setThumbnail(member.user.avatarURL({size: 512}).replace('webp', 'png').replace('webm', 'gif'))
                    .setDescription(pages[i].map(page => `\`[${page.id}]\` ${page.reason}`))
                    .setTimestamp()
                embeds.push(embed);
            }
            message.paginate(embeds);
        } else {
            if (!message.member.permissions.has('MANAGE_GUILD')) {
                return message.responder.error('**You must have the manage server permission to clear infractions**');
            }
            if (member.id === message.author.id) {
                return message.responder.error('**You can\'t clear your own warnings**');
            }
            if (!id) {
                return message.responder.error('**Provide the unique ID for the warning you want to remove or type \`all\` to clear all warnings**');
            }
            if (warnings.length < 1) {
                return message.responder.error(`**\`${member.user.tag}\` has no warnings to clear**`);
            }
            if (id !== 'all') {
                if (warnings.filter(warning => warning.id === id).length < 1) {
                    return message.responder.error(`**The unique warning ID** \`${id}\` **was not found**`);
                }
                /* let valueToFilter = warnings.filter(warning => warning.id === id)[0] */
                let filteredValue =  warnings.filter(warning => warning.id !== id)
                await member.settings.set(member.id, 'warnings', filteredValue);
                return message.responder.success(`**The warning with ID \`${id}\` for \`${member.user.tag}\` has been cleared**`);
            }
        }
    }
}
