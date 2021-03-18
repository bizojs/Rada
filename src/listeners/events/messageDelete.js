const { Listener } = require('discord-akairo');

module.exports = class messageDelete extends Listener {
    constructor() {
        super('messageDelete', {
            emitter: 'client',
            event: 'messageDelete'
        });
    }

    async exec(message) {
        if (message.channel.type === "dm") return;
        let logs = message.guild.channels.cache.get(message.guild.settings.get(message.guild.id, 'logs'));
        if (logs && message.channel === logs) return;
        let MessageDeleteEmote = this.client.emojis.cache.find(e => e.name === "message_delete");
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setAuthor('Message delete', MessageDeleteEmote.url)
            .setTimestamp()
        let content;
        let contentTitle = message.content && message.content.length > 1024 ? "[1024+ Characters] Content" : "Content";
        if (message.content && message.content.length > 1024) {
            content = this.client.Util.trimString(message.content, 1000)
        } else {
            content = message.content
        }
        let extra_content;
        if (message.attachments.first() !== undefined) {
            extra_content = '**[Image is only cached for 1 week]**\n' + message.attachments.first().proxyURL;
        } else {
            extra_content = "[Embed]";
        }
        if (logs) {
            embed.addField('User', `${message.author}\n\`${message.author.tag} [${message.author.id}]\``, true)
                .addField('Channel', `${message.channel}\n\`${message.channel.name} [${message.channel.id}]\``, true)
                .addField(contentTitle, content ? content : extra_content === '[Embed]' ? '⬇ Embed ⬇' : '')
            if (message.attachments.first() !== undefined) {
                embed.setImage(message.attachments.first().proxyURL);
            }
            let msg = await logs.send(embed);
            if (message.embeds.length > 1) {
                let logged = await logs.send(message.embeds[0]);
                let embed = msg.embeds[0];
                embed.fields[2].value = `⬇ [Embed](${logged.jumplink}) ⬇`
                msg.edit(embed)
            }
            return;
        }
    }
}