const { Command } = require('discord-akairo');

module.exports = class WarningsCommand extends Command {
    constructor() {
        super('warnings', {
            aliases: ['warnings', 'warns'],
            category: 'Moderation',
            description: {
                content: 'Warning settings for a user',
                extended: 'With this command you can View **all** warnings a user has, view a specific warning, delete a specific warning or delete all warnings.\nFind the "Examples" field below',
                examples: (message) => [
                    `\`${message.guild.prefix}warnings <User>\` - View all warnings`,
                    `\`${message.guild.prefix}warnings <User> <WarnID>\` - View specific warning`,
                    `\`${message.guild.prefix}warnings <User> clear <WarnID>\` - Clear a specific warning`,
                    `\`${message.guild.prefix}warnings <User> clear all\` - Clear all warnings`,
                ],
                permissions: ['EMBED_LINKS']
            },
            args: [{
                id: 'member',
                type: 'member',
                default: message => message.member
            },
            {
                id: 'clear',
                default: null
            },
            {
                id: 'id',
                default: null
            }],
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec(message, { member, clear, id }) {
        let warnings = member.settings.get(member.id, 'warnings', [])
        if (clear !== 'clear') { // "clear" didnt match, view warning(s)

            if (warnings.length < 1) { // Member has no warnings
                return message.responder.error(`**\`${member.user.tag}\` has no warnings**`);
            }

            let guildWarnings = warnings.filter(warning => warning.guild_id === message.guild.id)
            if (guildWarnings.length < 1) { // Member has no warnings
                return message.responder.error(`**\`${member.user.tag}\` has no warnings in this guild**`);
            }

            if (!clear) { // no ID, view all warnings

                let embeds = [];
                let pages = this.client.chunkify(guildWarnings, 5);
                for (let i = 0; i < pages.length; i ++) {
                    let embed = this.client.util.embed()
                        .setTitle(`Warnings for ${member.user.username} (${member.settings.get(member.id, 'warnings', []).length} total)`)
                        .setColor(this.client.color)
                        .setThumbnail(member.user.avatarURL({size: 512}).replace('webp', 'png').replace('webm', 'gif'))
                        .setDescription(pages[i].map(page => `\`[${page.id}]\` ${page.fullReason}`))
                        .setTimestamp()
                    embeds.push(embed);
                }
                message.paginate(embeds);

            } else { // ID found, view that ID
            
                let warning = guildWarnings.filter(warning => warning.id === clear)[0];
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

        } else if (clear.toLowerCase() === 'clear') { // "clear" matched, clear warning(s)
            
            let guildWarnings = warnings.filter(warning => warning.guild_id === message.guild.id)
            if (!message.member.permissions.has('MANAGE_GUILD')) {
                return message.responder.error('**You must have the manage server permission to clear infractions**');
            }
            if (member.id === message.author.id) {
                return message.responder.error('**You can\'t clear your own warnings**');
            }
            if (!id) {
                return message.responder.error('**Provide the unique ID for the warning you want to remove or type \`all\` to clear all warnings**');
            }

            if (id.toLowerCase() !== 'all') { // clear specific warning
                
                if (guildWarnings.filter(warning => warning.id === id).length < 1) {
                    return message.responder.error(`**The unique warning ID** \`${id}\` **was not found**`);
                }
                let filteredValue = guildWarnings.filter(warning => warning.id !== id)
                await member.settings.set(member.id, 'warnings', filteredValue);
                return message.responder.success(`**The warning with the ID \`${id}\` for \`${member.user.tag}\` has been cleared**`);
            
            } else { // clear all warnings
                let guildWarningsFilter = warnings.filter(warning => warning.guild_id !== message.guild.id)
                await member.settings.set(member.id, 'warnings', guildWarningsFilter.length > 1 ? guildWarningsFilter : []);
                return message.responder.success(`**All warnings for \`${member.user.tag}\` have been cleared**`);
            
            }

        }
    }
}
