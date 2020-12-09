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
                id: 'i',
                type: 'lowercase',
                default: null
            }],
        });
        // this.seen = new Set();
    }

    async exec(message, { member, clear, i }) {
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
                    .addField(`Count: ${member.settings.get(member.id, 'warnings', []).length}`, pages[i])
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
            if (!i) {
                return message.responder.error('**Provide a number for the warning you want to remove or type \`all\` to clear all warnings**');
            }
            if (warnings.length < 1) {
                return message.responder.error(`**\`${member.user.tag}\` has no warnings to clear**`);
            }
            if (!isNaN(parseInt(i))) {
                if (!warnings[i - 1]) {
                    return message.responder.error(`**The case number** \`#${Number(i)}\` **was not found** (${warnings.length === 1 ? 'Only 1 warning to clear' : `Number must be between 1 and ${warnings.length}`})`);
                }
                let value = warnings[i - 1];

                // for (let i = 0; i < warnings.length; i++) {
                //     if (!this.seen.has(warnings[i])) {
                //         this.seen.add(warnings[i])
                //     }
                // }

                /* you can filter with a filter callback that "remembers" stuff ... */
                // warnings.filter(warning => (seen.has(warning) || (seen.add(warning), seen.has(warning))) )
                /* so here I remove all elements of input where is_nice returns false, but only if I haven't seen that element before */

                // let toFilter = warnings.filter(item => item === value);
                // if (toFilter.length > 1) {
                //     for (let i = 0; i < toFilter.length; i++)
                //     toFilter = toFilter.map((warn, i) => `${i+1} ${warn}`)
                //     warnings = warnings.map((warn, i) => `${i+1} ${warn}`)
                // }
                await member.settings.set(member.id, 'warnings', warnings.filter(item => item !== value));
                return message.responder.success(`**The case number \`#${Number(i)}\` for \`${member.user.tag}\` has been cleared**`);
            }
            if (i === 'all') {
                member.clearWarns();
                return message.responder.success(warnings.length === 1 ? `**\`1 warning\` for \`${member.user.tag}\` has been cleared**` : `**\`${warnings.length} warnings\` for \`${member.user.tag}\` have been cleared**`); 
            }
        }
    }
}

module.exports = PunishmentsCommand;