const { Command } = require('discord-akairo');

module.exports = class DeleteEmojiCommand extends Command {
    constructor() {
        super('deleteemoji', {
            aliases: ['deleteemoji', 'de'],
            category: 'Utility',
            description: {
                content: 'Delete an emoji from the guild',
                permissions: ['MANAGE_EMOJIS']
            },
            args: [{
                id: 'emoji',
                type: 'emoji',
                default: null
            }],
            userPermissions: ['MANAGE_EMOJIS'],
            clientPermissions: ['MANAGE_EMOJIS']
        })
    }

    async exec(message, { emoji }) {
        if (!emoji) {
            return message.responder.error('**Please provide a valid image url or attachment**');
        }
        let name = emoji.name;
        await emoji.delete(`Emote deleted by ${message.author.tag}`);
        return message.responder.success(`**The emote __${name}__ has been deleted from the server**`);
    }
}