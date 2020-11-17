const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class HelpCommand extends Command {
    constructor() {
        super('help', {
            aliases: ['help', 'h'],
            category: 'Miscellaneous',
            description: {
                content: 'View all commands available.\nAdd a command name after to view information about that specific command.',
                permissions: ['EMBED_LINKS']
            },
            args: [{
                id: 'command',
                type: 'command',
                default: null
            }]
        });
    }

    exec(message, args) {
        let embed = new MessageEmbed()
            .setTitle(`${this.client.user.username} help menu`)
            .setThumbnail(this.client.avatar)
            .setDescription(`ℹ️ You can get additional help on a command by using \`${this.client.settings.get(message.guild.id, 'prefix', require('../../config.js').production ? require('../../config.js').prefix : require('../../config.js').devPrefix)}help (command_name)\``)
            .setColor(this.client.color)
            .setFooter(`Requested by ${message.author.username}`)
            .setTimestamp();
        if (args.command) {
            if (args.command.ownerOnly && !this.client.ownerID.includes(message.author.id)) {
                return message.channel.send(this.generateHelp(embed));
            }
            embed.setDescription(`Help for command **${args.command.id}**${args.command.ownerOnly ? ' (Owner only)' : ''}`)
            embed.addField('Description', args.command.description.content)
            embed.addField('Category', args.command.categoryID)
            if (args.command.description.permissions.length > 0) {
                embed.addField(`Permission${args.command.description.permissions.length > 1 ? 's' : ''}`, `\`${args.command.description.permissions.join('\n')}\``)
            }
            if (args.command.aliases.length > 1) {
                embed.addField('Aliases', args.command.aliases.map(a => a).join(', '))
            }
            return message.channel.send(embed);
        } else {
            return message.channel.send(this.generateHelp(embed));
        }
    }
    generateHelp(embed) {
        this.client.commandHandler.categories.forEach(c => {
            let commandMap = [];
            this.client.commandHandler.categories
                .get(c.id)
                .forEach(m => commandMap.push(m.id));
            embed.addField(c.id, commandMap.length > 1 ? commandMap.join(', ') : commandMap)
        })
        return embed;
    }
}

module.exports = HelpCommand;