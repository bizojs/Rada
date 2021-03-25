const { Command ,Argument } = require('discord-akairo');
const { emotes } = require('../../../lib/constants');

module.exports = class AutoroleCommand extends Command {
        constructor() {
            super('autorole', {
                aliases: ['autorole', 'ar'],
                category: 'Config',
                description: {
                    content: 'A role that will be given to members when joining the server',
                    permissions: ['EMBED_LINKS']
                },
                args: [{
                    id: 'role',
                    type: Argument.union('role', 'string'),
                    default: null,
                }],
                userPermissions: ['MANAGE_GUILD'],
                clientPermissions: ['EMBED_LINKS']
            });
        }

        async exec(message, { role }) {
            let current = message.guild.settings.get(message.guild.id, 'autorole', null);
            let embed = this.client.util.embed()
                .setColor(this.client.color)
                .setFooter(`Requested by ${message.author.username}`)
                .setTimestamp()
            if (!role) {
                return message.util.send(this.current(message, embed, current));
            }
            if (role && role.position > message.guild.me.roles.highest.position) {
                embed.addField(`${emotes.error} | Failed`, 'The autorole must be lower than my highest role')
                return message.util.send(embed);
            }
            if (!role.id && role.toLowerCase() !== 'reset') {
                return message.util.send(this.current(message, embed, current));
            }
            if (!role.id && ['reset', 'clear', 'delete'].some(option => role.toLowerCase() === option)) {
                if (!current) {
                    embed.addField(`${emotes.error} | Failed`, 'There is no autorole to reset')
                    return message.util.send(embed); 
                }
                await message.guild.settings.set(message.guild.id, 'autorole', null);
                embed.addField(`${emotes.success} | Autorole reset`, 'The autorole has been reset')
                return message.util.send(embed);
            }
            if (role.id && role.id === current) {
                embed.addField(`${emotes.error} | Failed`, `The autorole is already \`@${role.name} (${role.id})\`...\nTry another role`)
                return message.util.send(embed);
            }
            await message.guild.settings.set(message.guild.id, 'autorole', role.id);
            embed.addField(`${emotes.success} | Autorole updated`, `The autorole has been set to \`@${role.name} (${role.id})\`\nYou can reset it with \`${message.guild.prefix}autorole reset\``)
            return message.util.send(embed);
        }
        current(message, embed, current) {
                embed.setTitle(`${this.client.user.username} autorole settings`)
                    .setDescription('You can find information about the autorole below.')
                    .addField('Current autorole', `${current ? `${message.emotes.checked} ${message.guild.roles.cache.get(current)}` : `${message.emotes.unchecked} None`}`)
            .addField('Update autorole', `\`${message.guild.prefix}autorole <@role>\``)
            .addField('Reset autorole', `\`${message.guild.prefix}autorole reset\``)
        return embed;
    }
}