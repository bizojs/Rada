const { Listener } = require('discord-akairo');

module.exports = class messageReactionRemoveAll extends Listener {
    constructor() {
        super('messageReactionRemoveAll', {
            emitter: 'client',
            event: 'messageReactionRemoveAll'
        });
        this.image = 'https://i.imgur.com/lOS3tKf.png';
    }

    async exec(message) {
        if (message.channel.type === "dm") return;
        let logs = message.guild.channels.cache.get(message.guild.settings.get(message.guild.id, 'logs'));
        if (logs && message.channel === logs) return;
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setAuthor('Reaction remove [all]', this.image)
            .setTimestamp()
        if (logs) {
            let channel = message.guild.channels.cache.get(message.channel.id);
            channel.messages.fetch(message.id).then(msg => {
                embed.setDescription(`All reactions have been removed from a message ➜ [jumplink](${msg.jumplink})`)
                    .addField('User', `${msg.author}\n\`${msg.author.tag} [${msg.author.id}]\``, true)
                    .addField('Channel', `${msg.channel}\n\`${msg.channel.name} [${msg.channel.id}]\``, true)
                    .addField('Content', msg.content.length > 1024 ? this.client.Util.trimString(msg.content, 500) : msg.content ? msg.content : msg.attachments.first() ? msg.attachments.first().proxyURL : msg.embeds.length > 0 ? `[Embed](${msg.jumplink})` : 'Unknown')
                if (message.attachments.first() !== undefined) {
                    embed.setImage(msg.attachments.first().proxyURL);
                }
                logs.send(embed);
            })
        }
    }
}