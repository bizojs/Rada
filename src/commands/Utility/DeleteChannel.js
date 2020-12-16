const { Command } = require('discord-akairo');

class DeleteChannelCommand extends Command {
    constructor() {
        super('deletechannel', {
            aliases: ['deletechannel'],
            category: 'Utility',
            description: {
                content: 'Deletes a channel from the server.',
                permissions: ['MANAGE_CHANNELS']
            },
            args: [{
                id: 'channel',
                type: 'channel',
                match: 'rest',
                default: null
            }],
            userPermissions: ['MANAGE_CHANNELS'],
            clientPermissions: ['MANAGE_CHANNELS']
        })
    }

    async exec(message, { channel }) {
        if (!channel) {
            return message.responder.error(`**Please provide a channel to delete**`);
        }
        let chan = channel; 
        try {
            await channel.delete(`Channel deleted by ${message.author.tag}`);
            return message.responder.success(`**The ${chan.type === 'category' ? 'category' : 'channel'} ${chan.type === 'voice' ? `🔊 __${chan.name}__` : chan.type === 'text' ? `__${chan.name}__` : `<:category:653934820761665547> __${chan.name}__`} has been deleted**`);
        } catch (e) {
            return message.responder.error(`**${e.message}**`);
        }
    }
}
module.exports = DeleteChannelCommand;