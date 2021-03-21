const { Command, Argument } = require('discord-akairo');
const { emotes } = require('../../../lib/constants');

module.exports = class VoteChannelCommand extends Command {
        constructor() {
            super('votechannel', {
                aliases: ['votechannel', 'vc'],
                category: 'Config',
                description: {
                    content: 'A channel where the bot reacts to anything you send',
                    permissions: ['EMBED_LINKS']
                },
                args: [{
                    id: 'channel',
                    type: Argument.union('textChannel', 'string'),
                    default: null,
                }],
                userPermissions: ['MANAGE_GUILD'],
                clientPermissions: ['EMBED_LINKS']
            });
        }

        async exec(message, { channel }) {
            let current = message.guild.settings.get(message.guild.id, 'vote', false);
            let embed = this.client.util.embed()
                .setColor(this.client.color)
                .setFooter(`Requested by ${message.author.username}`)
                .setTimestamp()
            if (!channel) {
                return message.util.send(this.current(message, embed, current));
            }
            if (!channel.id && channel.toLowerCase() !== 'reset') {
                return message.util.send(this.current(message, embed, current));
            }
            if (!channel.id && channel.toLowerCase() === 'reset') {
                await message.guild.settings.set(message.guild.id, 'vote', null);
                embed.addField(`${emotes.success} | Vote channel reset`, 'The vote channel has been reset')
                return message.util.send(embed);
            }
            if (channel.id && channel.id === current) {
                embed.addField(`${emotes.error} | Failed`, `The vote channel is already \`#${channel.name} (${channel.id})\`...\nTry another channel`)
                return message.util.send(embed);
            }
            await message.guild.settings.set(message.guild.id, 'vote', channel.id);
            embed.addField(`${emotes.success} | Vote channel updated`, `The vote channel has been set to \`#${channel.name} (${channel.id})\`\nYou can reset it with \`${message.guild.prefix}votechannel reset\``)
            return message.util.send(embed);
        }
        current(message, embed, current) {
                embed.setTitle(`${this.client.user.username} vote channel settings`)
                    .setDescription('You can find information about the vote channel below.')
                    .addField('Current channel', `${current ? `${message.emotes.checked} ${message.guild.channels.cache.get(current)}` : `${message.emotes.unchecked} None`}`)
            .addField('Update channel', `\`${message.guild.prefix}votechannel <#channel>\``)
            .addField('Reset channel', `\`${message.guild.prefix}votechannel reset\``)
        return embed;
    }
}