const { Inhibitor } = require('discord-akairo');

module.exports = class VoteChannel extends Inhibitor {
    constructor() {
        super('votechannel', {
            type: 'all'
        });
    }

    async exec(message) {
        if (message.channel.type === 'dm') return;
        if (message.channel.id === message.guild.settings.get(message.guild.id, 'vote', null)) {
            if (!message.guild.me.permissions.has('ADD_REACTIONS') || !message.channel.permissionsFor(message.guild.me).has('ADD_REACTIONS')) {
                return message.responder.error('**This channel is set as the vote channel, but I don\'t have permission to add reactions**');
            }
            await message.vote();
        }
    }
}