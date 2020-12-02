const { Inhibitor } = require('discord-akairo');

class Antilink extends Inhibitor {
    constructor() {
        super('antilink', {
            type: 'all'
        });
        this.cache = new Set();
    }

    async exec(message) {
        let antilink = message.guild.settings.get(message.guild.id, 'antilink', false);
        let regex = /discord(?:(\.(?:me|io|li|gg)|sites\.com|list\.me)\/.{0,4}|app\.com.{1,4}(?:invite|api|oauth2).{0,5}\/)\w+/;
        const key = `${message.author.id}.antilink-cooldown`;
        if (antilink) {
            if (message.author.bot) return;
            if (message.content.match(regex)) {
                if (message.guild.me.permissions.has('MANAGE_MESSAGES')) {
                    if (this.cache.has(key)) {
                        await message.delete();
                        return;
                    } else {
                        await message.delete().then(async () => {
                            this.cache.add(key);
                            setTimeout(() => this.cache.delete(key), 300000);
                            return message.responder.error(`${message.author} **Advertising is not allowed**`);
                        })
                    }
                } else {
                    return message.responder.error(`${message.author} **Advertising is not allowed**\nI lack the permission to manage messages so I was unable to delete the link.`);
                }
            }
        }
    }
}

module.exports = Antilink;