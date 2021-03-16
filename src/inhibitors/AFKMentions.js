const { Inhibitor } = require('discord-akairo');

module.exports = class AFKMentions extends Inhibitor {
    constructor() {
        super('afkmentions', {
            type: 'all'
        });
    }

    async exec(message) {
        if (message.channel.type === 'dm') return;
        if (message.mentions.users.size < 1) return;
        if (message.author.bot) return;
        let obj = { afk: false, message: null };
        let mentioned = message.mentions.users.first();
        if (mentioned.bot) return;
        let mentionedAfk = await mentioned.settings.get(mentioned.id, 'afk', obj);
        let embed = this.client.util.embed()
            .setTitle('AFK')
            .setColor(this.client.color)
            .setDescription(`**${mentioned.username}** is currently AFK with the reason **${mentionedAfk.message}**\nThey will be notified of your ping when they get back!`)
            .setTimestamp();
        if (mentionedAfk.afk) {
            await mentioned.addAfkPing(`**${message.author.tag}** ➜ [${message.guild.name}] : [${message.content}](${message.jumplink})`)
            return message.channel.send(`<@!${message.author.id}>`, embed)
        }
    }
}