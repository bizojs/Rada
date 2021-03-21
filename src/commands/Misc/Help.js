const { Command, Argument } = require('discord-akairo');
const Util = require('../../../lib/structures/Util');

class HelpCommand extends Command {
    constructor() {
        super('help', {
            aliases: ['help', 'h'],
            category: 'Miscellaneous',
            description: {
                content: 'View all commands available.',
                extended: 'Add a command name after to view information about that specific command.',
                permissions: ['EMBED_LINKS']
            },
            args: [{
                id: 'command',
                type: Argument.union('command', 'commandAlias', 'string'),
                default: null
            }],
            clientPermissions: ['EMBED_LINKS']
        });
    }

    exec(message, args) {
        let embed = this.client.util.embed()
            .setTitle(`${this.client.user.username} help menu`)
            .setThumbnail(this.client.avatar)
            .setColor(this.client.color)
            .setFooter(`Requested by ${message.author.username}`)
            .setTimestamp();
        if (typeof args.command !== 'string' && args.command) {
            if (args.command.ownerOnly && !this.client.ownerID.includes(message.author.id)) {
                return message.util.send(this.generateHelp(message));
            }
            embed.setDescription(`Help for command **${args.command.id}**${args.command.ownerOnly ? ' (Owner only)' : args.command.nsfw ? ' (NSFW)' : ''}`)
            embed.addField('Description', args.command.description.extended ? `${args.command.description.content}\n${args.command.description.extended}` : args.command.description.content)
            if (args.command.description.examples && args.command.description.examples.length > 0) {
                embed.addField('Examples', args.command.description.examples(message).map(a => a).join('\n'))
            }
            embed.addField('Category', args.command.categoryID)
            if (args.command.description.permissions.length > 0) {
                embed.addField(`Permission${args.command.description.permissions.length > 1 ? 's' : ''}`, `\`${args.command.description.permissions.join('\n')}\``)
            }
            if (args.command.aliases.length > 1) {
                embed.addField('Aliases', args.command.aliases.map(a => a).join(', '))
            }
            return message.util.send(embed);
        } else {
            let category = args.command ? this.client.commandHandler.findCategory(args.command) : null;
            if (category) {
                let categoryEmbed = this.client.util.embed()
                    .setTitle(`${this.client.user.username} help menu for __${category.id}__ category`)
                    .setThumbnail(this.client.avatar)
                    .setDescription(category.map(cmd => `\`${Util.toTitleCase(cmd.id)}\`${cmd.ownerOnly ? ' **(Owner only)**' : cmd.nsfw ? ' **(NSFW)**' : ''} - ${cmd.description.content}`).join('\n'))
                    .setThumbnail(this.client.avatar)
                    .setColor(this.client.color)
                    .setFooter(`Requested by ${message.author.username}`)
                    .setTimestamp();
                return message.util.send(categoryEmbed)
            }
            return message.paginate(this.generateHelp(message));
        }
    }

    generateHelp(message) {
        let embeds = [];
        let categories = this.client.commandHandler.categories;
        let categoryMap = [];
        for (let i = 1; i < categories.size + 1; i++) {
            categoryMap.push(`\`${i + 1}.\` ${categories.map(c => c.id)[i - 1]}`)
        }
        let helpEmbed = this.client.util.embed()
            .setTitle(`${this.client.user.username} help menu`)
            .setThumbnail(this.client.avatar)
            .setDescription(`Welcome to the help menu. You can use the reactions below to cycle through the various categories that are available. You can find out what each reaction does in the \`Reaction help\` section of this embed.\n\nYou can get additional help on a command by using \`${message.guild.prefix}help (command_name)\``)
            .addField('Reaction help', [
                '⏪ - Skip back to page 1',
                '◀ - Skip back a page',
                '🗑️ - Remove all reactions',
                '▶ - Skip forward a page',
                '⏩ - Skip to the last page'
            ].join('\n'))
            .addField('Pages', '\`1.\` This page\n' + categoryMap.join('\n'))
            .setColor(this.client.color)
            .setFooter(`Requested by ${message.author.username}`)
            .setTimestamp()
        embeds.push(helpEmbed)
        this.client.commandHandler.categories.forEach(category => {
            let commandMap = [];
            this.client.commandHandler.categories.get(category.id).forEach(command => {
                commandMap.push(`\`${Util.toTitleCase(command.id)}\` - ${command.description.content.split('.')[0]}`)
            })
            let embed = this.client.util.embed()
                .setTitle(`${this.client.user.username} help menu - ${category.id} (${category.size} commands)`)
                .setThumbnail(this.client.avatar)
                .setColor(this.client.color)
                .setTimestamp()
                .setDescription(commandMap.length > 1 ? commandMap.join('\n') : commandMap)
            embeds.push(embed)
        })
        return embeds;
    }

    trim = (str, max = 30) => {
        if (str.length > max) return `${str.substr(0, max)}...`;
        return str;
    };
}

module.exports = HelpCommand;