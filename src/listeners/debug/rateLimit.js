const { Listener } = require('discord-akairo');

module.exports = class RateLimit extends Listener {
    constructor() {
        super('rateLimit', {
            emitter: 'client',
            event: 'rateLimit'
        });
    }

    async exec(rateLimitInfo) {
        let parts = rateLimitInfo.path.split(/\//);
        if (parts[5] && parts[5] === 'reactions') return;

        this.client.log.rateLimit(rateLimitInfo, this.client);

        let guild = this.client.channels.cache.get(parts[2]).guild;
        let caching = await this.client.users.fetch(guild.ownerID);
        let guildOwner = this.client.users.cache.get(caching.id);

        let WarnEmote = this.client.emojis.cache.get(guild.emoteID.info);

        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setAuthor('[Spam Warning]', WarnEmote.url)
            .setThumbnail(this.client.avatar)
            .setDescription(`**${this.client.user.username}** is currently being ratelimited`)
            .addField('Timeout', rateLimitInfo.timeout, true)
            .addField('Method', `${rateLimitInfo.method} ➜ ${parts[3]}${parts[5] ? ` ➜ ${parts[5]}` : ''}`, true)
            .addField('Path', `\`${rateLimitInfo.path}\``)
            .addField('Guild', `${guild.name}\n${guild.id}`, true)
            .addField('Guild Owner', `${guildOwner.tag}\n${guild.ownerID}`, true)
            .setTimestamp()
        this.client.channels.cache.get('822439212623593502').send(embed);
    }
};