const { Command } = require('discord-akairo');

class PunishmentsCommand extends Command {
    constructor() {
        super('warnings', {
            aliases: ['warnings', 'infractions'],
            category: 'Moderation',
            description: {
                content: 'View the warnings that a user has',
                permissions: ['EMBED_MESSAGES']
            },
            args: [{
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
            }],
        });
        // this.seen = new Set();
    }

    async exec(message, { member, clear, id }) {
        let warnings = member.settings.get(member.id, 'warnings', [])
        if (!clear) {
            if (warnings.length < 1) {
                return message.responder.error(`**\`${member.user.tag}\` has no warnings**`);
            }
            let embeds = [];
            let pages = this.client.chunkify(warnings, 5);
            for (let i = 0; i < pages.length; i ++) {
                let embed = this.client.util.embed()
                    .setTitle(`Warnings for ${member.user.username}`)
                    .setColor(this.client.color)
                    .setThumbnail(member.user.avatarURL({size: 512}).replace('webp', 'png').replace('webm', 'gif'))
                    .addField(`Count: ${member.settings.get(member.id, 'warnings', []).length}`, pages[i].map(page => `\`[${page.id}]\` ${page.reason}`))
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
            if (i === 'all') {
                member.clearWarns();
                return message.responder.success(warnings.length === 1 ? `**\`1 warning\` for \`${member.user.tag}\` has been cleared**` : `**\`${warnings.length} warnings\` for \`${member.user.tag}\` have been cleared**`); 
            }
        }
    }
}

module.exports = PunishmentsCommand;