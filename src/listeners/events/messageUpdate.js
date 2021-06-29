const { Listener } = require('discord-akairo');

module.exports = class messageUpdate extends Listener {
    constructor() {
        super('messageUpdate', {
            emitter: 'client',
            event: 'messageUpdate'
        });
        this.cache = new Set();
    }

    async exec(message, oldMessage, newMessage) {
        if (message.channel.type === "dm") return;
        let logs = message.guild.channels.cache.get(message.guild.settings.get(message.guild.id, 'logs'));
        let antilink = message.guild.channels.cache.get(message.guild.settings.get(message.guild.id, 'antilink', null));
        if (logs && message.channel === logs) return;
        let MessageUpdateEmote = this.client.emojis.cache.find(e => e.name === "message_update");
        let AntilinkEmote = this.client.emojis.cache.get(message.emoteID.info);
        let message1 = message.content;
        let caching = await this.client.users.fetch(message.author.id).catch(() => {});
        let cached = this.client.users.cache.get(caching.id)
        let user = cached.tag || null;
        if ([oldMessage, oldMessage.content].some(content => content === message1)) return;
        let oldContent;
        let newContent;
        let oldContentTitle = message1.length > 1024 ? "[1024+ Characters] Old Message" : "Old Message";
        let newContentTitle = oldMessage.content.length > 1024 ? "[1024+ Characters] New Message" : "New Message";
        if (message1 && message1.length > 1024) {
            oldContent = this.client.Util.trimString(message1, 1000);
        } else if (message1 && message1.length < 1024) {
            oldContent = message1;
        } else if (message.attachments.size > 0) {
            oldContent = message.attachments.first().url;
        } else if (message.embeds.length > 0) {
            oldContent = `[Embed](${message.jumplink})`
        }
        if (oldMessage.content && oldMessage.content.length > 1024) {
            newContent = this.client.Util.trimString(oldMessage.content, 1000);
        } else if (oldMessage.content && oldMessage.content.length < 1024) {
            newContent = oldMessage.content;
        } else if (oldMessage.attachments.size > 0) {
            newContent = oldMessage.attachments.first().url;
        } else if (oldMessage.embeds.length > 0) {
            newContent = `[Embed](${oldMessage.jumplink})`
        }

        let messageEditEmbed = this.client.util.embed()
            .setColor(this.client.color)
            .setAuthor('Message edit', MessageUpdateEmote.url)
            .setTimestamp()
        let antilinkEmbed = this.client.util.embed()
            .setColor(this.client.color)
            .setAuthor('Antilink', AntilinkEmote.url)
            .setTimestamp()
        if (logs) {
            messageEditEmbed.setDescription(`A message from **${user}** was edited in ${message.channel}`)
                .addField(oldContentTitle, oldContent)
                .addField(newContentTitle, newContent)
            logs.send(messageEditEmbed);
        }
        if (antilink) {
            const key = `${message.author.id}.antilink-cooldown`;
            if (!message.guild.me.permissions.has('MANAGE_MESSAGES')) return;
            if (oldMessage.content.match(message.regex.invites)) {
                if (this.cache.has(key)) {
                    await message.delete();
                    if (logs) {
                        antilinkEmbed.setDescription(`**${message.author.tag}** tried to bypass the antilink by editing their message in ${message.channel}`)
                            .addField(oldContentTitle, oldContent)
                            .addField(newContentTitle, newContent)
                        return logs.send(antilinkEmbed);
                    }
                } else {
                    await message.delete();
                    this.cache.add(key);
                    setTimeout(() => this.cache.delete(key), 300 * 1000);
                    message.channel.send(`${message.emotes.error} | ${message.author} **Advertising is not allowed.**`);
                    if (logs) {
                        antilinkEmbed.setDescription(`**${message.author.tag}** tried to bypass the antilink by editing their message in ${message.channel}`)
                            .addField(oldContentTitle, oldContent)
                            .addField(newContentTitle, newContent)
                        return logs.send(antilinkEmbed);
                    }
                }
            }
        }
    }
}
