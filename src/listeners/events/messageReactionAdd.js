const { Listener } = require('discord-akairo');

class MessageReactionAddListener extends Listener {
    constructor() {
        super('messageReactionAdd', {
            emitter: 'commandHandler',
            event: 'messageReactionAdd'
        });
    }

    async exec(reaction, user) {
        console.log(`Reaction triggered by ${user.tag} [${reaction.emoji.name}]`)
    }
};
module.exports = MessageReactionAddListener;