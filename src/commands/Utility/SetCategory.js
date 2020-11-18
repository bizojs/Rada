const { Command } = require('discord-akairo');
const { production, prefix, devPrefix } = require('../../config');

class SetCategoryCommand extends Command {
    constructor() {
        super('setcategory', {
            aliases: ['setcategory', 'sc', 'setparent', 'move'],
            description: {
                content: 'Move a channel into a different category',
                permissions: ['MANAGE_CHANNELS']
            },
            separator: ',',
            args: [{
                id: 'channel',
                type: 'channel',
                default: null
            },
            {
                id: 'category',
                type: 'channel',
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
    async exec(message, { channel, category }) {
        if (!channel) {
            return message.responder.error(`**Please provide the channel you want to change the category of**\nExample: \`${this.client.settings.get(message.guild.id, 'prefix', production ? prefix : devPrefix)}setcategory #mod-logs, staff\`\n                  \`${this.client.settings.get(message.guild.id, 'prefix', production ? prefix : devPrefix)}setcategory Karaoke 🎤, voice channels\``);
        }
        if (!category) {
            return message.responder.error(`**Please provide the category you want to change ${channel.type === 'voice' ? `🔊 \`${channel.name}\`` : channel.type === 'text' ? c : `<:category:653934820761665547> \`${channel.name}\``} to** *(separate with a comma)*`);
        }
        if (category.type !== 'category') {
            return message.responder.error('**You must not provide a channel as the category**');
        }
        if (channel.type === 'category') {
            return message.responder.error('**You must not provide a category as the channel**');
        }
        let oldCategory = channel.parent ? channel.parent.name : 'None'
        console.log(oldCategory)
        if (oldCategory === category.name) {
            return message.responder.error(`**The category for ${channel.type === 'voice' ? `🔊 \`${channel.name}\`` : channel} is already \`${category.name}\`**`);
        }
        try {
            if (!category.permissionsFor(message.guild.me).has('MANAGE_CHANNELS')) {
                await category.overwritePermissions([{
                    id: message.guild.me,
                    allow: ['MANAGE_CHANNELS'],
             }], 'Updating permissions for the setcategory command');
            }
            channel.setParent(category.id, {
                reason: `${message.author.tag} changed the category of ${channel.name} from ${oldCategory} to ${category.name}`
            })
            return message.responder.success(`**The category for ${channel.type === 'voice' ? `🔊 \`${channel.name}\`` : channel} has been changed from \`${oldCategory}\` to \`${category.name}\`**`);
        } catch (e) {
            return message.responder.error(`**${e.message}**`);
        }
    }
}
module.exports = SetCategoryCommand;