const { Inhibitor } = require('discord-akairo');

class BlacklistInhibitor extends Inhibitor {
    constructor() {
        super('blacklist', {
            reason: 'blacklist'
        })
    }

    exec(message) {
        // He's a meanie!
        if (message.channel.type === 'dm') return;
        const blacklist = [];
        return blacklist.includes(message.author.id);
    }
}

module.exports = BlacklistInhibitor;