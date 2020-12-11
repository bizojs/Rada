const { Command } = require('discord-akairo');

class AddEmojiCommand extends Command {
    constructor() {
        super('addemoji', {
            aliases: ['addemoji', 'createemoji'],
            category: 'Utility',
            description: {
                content: 'Add an emoji to the guild',
                permissions: ['MANAGE_EMOJIS']
            },
            args: [{
                id: 'name',
                type: 'string',
                unordered: true,
                default: null
            },
            {
                id: 'emoji',
                type: 'string',
                unordered: true,
                default: null
            }],
            userPermissions: ['MANAGE_EMOJIS'],
            clientPermissions: ['MANAGE_EMOJIS']
        })
    }

    async exec(message, { name, emoji }) {
        if (!name) {
            return message.responder.error('**Please provide a name for the emoji you are adding**');
        }
        if (!emoji && message.attachments.first() === undefined) {
            return message.responder.error('**Please provide a valid image url or attachment**');
        }
        try {

            if (message.attachments.first() !== undefined) {
                await message.guild.emojis.create(message.attachments.first().url, name, { reason: `Emote added by ${message.author.tag}`});
                return message.responder.success(`**The emote __${name}__ has been added to the server**`);
            }
            name.includes('http') ? 
            await message.guild.emojis.create(name, emoji, { reason: `Emote added by ${message.author.tag}`}) : 
            await message.guild.emojis.create(emoji, name, { reason: `Emote added by ${message.author.tag}`})
            return message.responder.success(`**The emote __${name.includes('http') ? emoji : name}__ has been added to the server**`);
        } catch (e) {
            if (e.message.includes('ENOENT')) {
                return message.responder.error('**Please provide a valid image url or attachment**');
            }
            return message.responder.error(`**${e.message}**`);
        }
    }
}
module.exports = AddEmojiCommand