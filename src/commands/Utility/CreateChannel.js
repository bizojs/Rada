const { Command } = require('discord-akairo');
const { production, prefix, devPrefix } = require('../../config');

class CreateChannelCommand extends Command {
    constructor() {
        super('createchannel', {
            aliases: ['createchannel', 'cc'],
            description: {
                content: 'Create a channel in the server. The first argument should be the type of channel you want to create, if no input is provided it will default to a text channel. The second argument is not required but can be a category you want the channel to be put in. The third argument will be the channel name.',
                permissions: ['MANAGE_CHANNELS']
            },
            args: [{
                id: 'type',
                type: /^(text|voice|category)$/i,
                default: 'text',
                unordered: true
            },
            {
                id: 'channel',
                type: 'string',
                match: 'rest',
                default: null
            }]
        })
    }
    clientPermissions(message) {
        if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) {
            return message.responder.error('**I require the permission to manage channels**');
        }
        return null
    }
    userPermissions(message) {
        if (!message.member.permissions.has('MANAGE_CHANNELS')) {
            return message.responder.error('**You require the permission to manage channels to run this command**');
        }
        return null
    }
    async exec(message, { type, channel }) {
        if (!channel) {
            return message.responder.error(`**Please provide a name for the new channel**\nFormat: \`<type|default:text> <name|default:none>\`\nExample: \`${this.client.settings.get(message.guild.id, 'prefix', production ? prefix : devPrefix)}cc voice Karaoke 🎤\``);
        }
        if (!type) {
            return message.responder.error(`**Please provide a valid channel type** \`<text|voice|category>\``);
        }
        let name = type.match[0] === 'text' ? channel.split(/\s/g).join('-') : channel.replace(type.match[0], '');
        try {
            message.guild.channels.create(name, {
                type: type.match[0],
                reason: `Channel created by ${message.author.tag}`,
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