const { Command } = require('discord-akairo');
const { emotes } = require('../../../lib/constants');
const Util = require('../../../lib/structures/Util');

module.exports = class AntilinkCommand extends Command {
    constructor() {
        super('antilink', {
            aliases: ['antilink'],
            category: 'Config',
            description: {
                content: 'Change the current antilink setting',
                permissions: ['EMBED_LINKS']
            },
            args: [{
                id: 'toggle',
                type: /^(on|off)$/i,
                default: null,
            }],
            userPermissions: ['MANAGE_GUILD'],
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec(message, { toggle }) {
        let current = message.guild.settings.get(message.guild.id, 'antilink', 'off');
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setFooter(`Requested by ${message.author.username}`)
            .setTimestamp()
        if (!toggle) {
            return message.util.send(this.current(message, embed, current));
        }
        if (toggle.match[0] === current) {
            embed.addField(`${emotes.error} | Failed`, `The antilink is already \`${Util.toTitleCase(toggle.match[0])}\`...`)
            return message.util.send(embed);
        }
        await message.guild.settings.set(message.guild.id, 'antilink', toggle.match[0]);
        embed.addField(`${emotes.success} | Antilink updated`, `The antilink is now \`${Util.toTitleCase(toggle.match[0])}\``)
        return message.util.send(embed);
    }
    current(message, embed, current) {
        embed.setTitle(`${this.client.user.username} antilink settings`)
            .setDescription('You can find information about the antilink below.')
            .addField('Current setting', current === 'on' ? message.emotes.checked : message.emotes.unchecked)
            .addField('Update setting', `\`${message.guild.prefix}antilink <on|off>\``)
        return embed;
    }
}