const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

module.exports = class AFKCommand extends Command {
    constructor() {
        super('afk', {
            aliases: ['afk'],
            category: 'Miscellaneous',
            description: {
                content: 'Set yourself as afk',
                permissions: []
            },
            args: [{
                id: 'message',
                type: 'string',
                match: 'rest',
                default: null
            }],
        });
    }

    async exec(message, args) {
        let afkCurrent = await message.author.settings.get(message.author.id, 'afk', { afk: false, message: null });
        if (!afkCurrent.afk) {
            let afkReason = args.message ? args.message : 'n/a';
            await message.author.settings.set(message.author.id, 'afk', { afk: true, message: afkReason });
            let embed = this.client.util.embed()
                .setTitle('AFK')
                .setDescription(`You are now set as afk with the reason **${afkReason}**\nYour AFK status will be cleared when you next speak.`)
                .setColor(this.client.color)
                .setTimestamp();
            return message.util.send(embed);
        }
    }
}