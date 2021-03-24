const { Command } = require('discord-akairo');

class CreateChannelCommand extends Command {
    constructor() {
        super('createchannel', {
            aliases: ['createchannel', 'cc'],
            category: 'Utility',
            description: {
                content: 'Create a channel in the server.',
                extended: 'The first argument is the name, the second argument is the channel type flag \`--type=\` and then the last option is the nsfw flag \`--nsfw\`',
                examples: (message) => [
                    `\`${message.guild.prefix}createchannel Silent Dawn --type=voice\``,
                    `\`${message.guild.prefix}createchannel epic-chat --type=text --nsfw\``,
                    `\`${message.guild.prefix}createchannel Information --type=category\``,
                ],
                permissions: ['MANAGE_CHANNELS']
            },
            args: [{
                    id: 'channel',
                    type: 'string',
                    match: 'rest',
                    default: null
                },
                {
                    id: 'type',
                    match: 'option',
                    flag: '--type=',
                    default: 'text',
                },
                {
                    id: 'nsfw',
                    match: 'flag',
                    flag: '--nsfw',
                }
            ],
            userPermissions: ['MANAGE_CHANNELS'],
            clientPermissions: ['MANAGE_CHANNELS']
        })
    }

    async exec(message, { channel, type, nsfw }) {
        if (!channel) {
            return message.responder.error(`**Please provide a name for the new channel**\nFormat: \`<name> <--type=type> [--nsfw=boolean]\`\nExample: \`${message.guild.prefix}cc Karaoke 🎤 --type=voice\``);
        }
        if (!type) {
            return message.responder.error(`**Please provide a valid channel type** \`text, voice, category\``);
        }
        let name = type === 'text' ? channel.split(/\s/g).join('-') : channel;
        try {
            message.guild.channels.create(name, {
                    type: type,
                    reason: `Channel created by ${message.author.tag}`,
                    nsfw: type === 'text' ? nsfw : null,
                    permissionOverwrites: [{
                        id: message.guild.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT', 'SPEAK', 'READ_MESSAGE_HISTORY']
                    }, {
                        id: message.guild.me.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT', 'SPEAK', 'READ_MESSAGE_HISTORY', 'MANAGE_CHANNELS']
                    }]
                })
                .then((c) => {
                    return message.responder.success(`**The ${c.type === 'category' ? 'category' : 'channel'} ${c.type === 'voice' ? `🔊 __${c.name}__` : c.type === 'text' ? `__${c}__` : `<:category:653934820761665547> __${c.name}__`} has been created**`);
                })
        } catch (e) {
            return message.responder.error(`**${e.message}**`);
        }
    }
}
module.exports = CreateChannelCommand;