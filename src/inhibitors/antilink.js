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
        let regex = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|com)|discordapp\.com\/invite)\/.+[a-z]{0,8}/
        const key = `${message.author.id}.antilink-cooldown`;
        if (antilink) {
            if (message.author.bot) return;
            if (message.content.match(regex)) {
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
            }
        }
    }
}

module.exports = Antilink;