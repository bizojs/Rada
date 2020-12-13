const { Inhibitor } = require('discord-akairo');
const { emotes } = require('../../lib/constants');

class Antilink extends Inhibitor {
    constructor() {
        super('antilink', {
            emitter: 'inhibitorHandler',
            type: 'all'
        });
        this.cache = new Set();
    }

    async exec(message) {
        if (message.author.id === message.guild.me.id) return;
        let antilink = message.guild.settings.get(message.guild.id, 'antilink', 'off');
        const key = `${message.author.id}.antilink-cooldown`;
        if (antilink === 'off') return;
        if (antilink === 'on') {
            let role = message.guild.roles.cache.find(r => r.name.toLowerCase().includes('bypass'));
            if (role && message.member.roles.cache.has(role.id)) return;
            if (message.content.match(message.regex.invites)) {
                await message.member.settings.set(message.member.id, 'history', message.member.settings.get(message.member.id, 'history', 0) + 1);
                if (message.guild.me.permissions.has('MANAGE_MESSAGES')) {
                    if (this.cache.has(key)) {
                        await message.delete();
                        return;
                    }
                    await message.reply(`${emotes.error} | ${message.author} **Advertising is not allowed**`);
                    await message.delete().then(() => {
                        this.cache.add(key);
                        setTimeout(() => this.cache.delete(key), 300000)
                    })
                    return;
                } else {
                    return message.channel.send(`${emotes.error} | ${message.author} **Advertising is not allowed**\nI lack the permission to manage messages so I was unable to delete the link.`);
                }
            }
        }
    }
}

module.exports = Antilink;