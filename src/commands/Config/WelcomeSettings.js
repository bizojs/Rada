const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const req = require('@aero/centra');

class WelcomeSettingsCommand extends Command {
    constructor() {
        super('welcomesettings', {
            aliases: ['welcomesettings', 'ws'],
            category: 'Config',
            description: {
                content: 'Edit the various welcome configurations available',
                permissions: ['EMBED_LINKS']
            },
            args: [{
                    id: 'option',
                    type: 'string',
                    default: null
                },
                {
                    id: 'channel',
                    type: 'textChannel',
                    default: null,
                    unordered: false
                }
            ],
            userPermissions: ['MANAGE_GUILD'],
            clientPermissions: ['EMBED_LINKS']
        });
        this.placeholders = [
            '{user} - The mention of the user',
            '{tag} - The user#discrim of the user',
            '{username} - The username of the user',
            '{servername} - The name of the server',
            '{membercount} - Member count of the server'
        ]
    }

    async exec(message, args) {
            let currentPrefix = message.guild.prefix;
            let embed = new MessageEmbed()
                .setColor(this.client.color)
                .setThumbnail(this.client.avatar)
                .setFooter(`Requested by ${message.author.tag}`)
                .setTimestamp()
            if (!args.option) {
                embed.setTitle(`${this.client.user.username} welcome settings`)
                    .setDescription(`__Info__\nYou will find any available welcome settings below\n\n__Update__\nYou can update one of the settings with \`${currentPrefix}ws (option) (value)\`\n\n__Examples__\n\`${currentPrefix}ws channel #welcome-leave\`\n\`${currentPrefix}ws join Hello {user}!\`\n\n__Preview__\nIf you have any of the messages set, you can get a live preview of them with the command \`${currentPrefix}ws visualise\``)
                    .addField('Channel', `${message.guild.settings.get(message.guild.id, 'wc', 'None') !== 'None' ? `${message.emotes.checked} ${message.guild.channels.cache.get(message.guild.settings.get(message.guild.id, 'wc'))} \`(${message.guild.settings.get(message.guild.id, 'wc')})\`` : message.emotes.unchecked}`)
                .addField('Message (join)', `${message.guild.settings.get(message.guild.id, 'jm', 'None') !== 'None' ? `> ${message.guild.settings.get(message.guild.id, 'jm')}` : message.emotes.unchecked}`)
                .addField('Message (leave)', `${message.guild.settings.get(message.guild.id, 'lm', 'None') !== 'None' ? `> ${message.guild.settings.get(message.guild.id, 'lm')}` : message.emotes.unchecked}`)
            return message.util.send(embed);
        }
        if (args.option === 'channel') {
            if (!args.channel) {
            embed.setTitle(`Welcome Channel`)
                .setDescription(`Update the welcome channel with \`${currentPrefix}settings wc #channel\``)
                .addField('Current channel', `${message.guild.settings.get(message.guild.id, 'wc', 'None') !== 'None' ? `${message.emotes.checked} ${message.guild.channels.cache.get(message.guild.settings.get(message.guild.id, 'wc'))} \`(${message.guild.settings.get(message.guild.id, 'wc')})\`` : message.emotes.unchecked}`);
            return message.util.send(embed);
            }
            if (!args.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) {
                return message.responder.error(`**For me to use \`#${args.channel.name}\` as the join/leave channel, I must have permission to send messages there.**`);
            }
            await message.guild.settings.set(message.guild.id, 'wc', args.channel.id);
            embed.setTitle(`Welcome channel updated`)
                .setDescription(`✅ **The welcome channel has been set to** ${args.channel} \`(${args.channel.id})\``)
            return message.util.send(embed);
        }
        if (args.option === 'visualise') {
            if (!message.guild.settings.get(message.guild.id, 'jm', false) && !message.guild.settings.get(message.guild.id, 'lm', false)) {
                return message.responder.error('**You have no join/leave messages to visualise**');
            }
            let visualised = [
                `**Join message**:\n${message.guild.settings.get(message.guild.id, 'jm', 'None') !== 'None' ? `${message.guild.settings.get(message.guild.id, 'jm').replace(/{user}/gi, message.author).replace(/{tag}/gi, message.author.tag).replace(/{username}/gi, message.author.username).replace(/{servername}/gi, message.guild.name).replace(/{membercount}/gi, message.guild.memberCount)}` : message.emotes.unchecked}`,
                `**Leave message**:\n${message.guild.settings.get(message.guild.id, 'lm', 'None') !== 'None' ? `${message.guild.settings.get(message.guild.id, 'lm').replace(/{user}/gi, message.author).replace(/{tag}/gi, message.author.tag).replace(/{username}/gi, message.author.username).replace(/{servername}/gi, message.guild.name).replace(/{membercount}/gi, message.guild.memberCount)}` : message.emotes.unchecked}`,
            ]
            return message.util.send(visualised.join('\n'))
        }
        if (args.option === 'join') {
            let msg = message.util.parsed.content.replace('join', '');
        if (msg.length < 1) {
            embed.setTitle(`Join Message`)
                .setDescription(`Update the join message with \`${currentPrefix}settings join <message>\``)
                .addField('Current message', `${message.guild.settings.get(message.guild.id, 'jm', 'None') !== 'None' ? `> ${message.guild.settings.get(message.guild.id, 'jm')}` : message.emotes.unchecked}`)
                .addField('Placeholders', this.placeholders);
            return message.util.send(embed);
        }
        await message.guild.settings.set(message.guild.id, 'jm', msg);
        embed.setTitle(`Join message updated`)
            .setDescription(`✅ **Your join message has been updated to**\n\`\`\`${msg}\`\`\``)
        return message.util.send(embed);
      }
        if (args.option === 'leave') {
            let msg = message.util.parsed.content.replace('leave', '');
            if (msg.length < 1) {
                embed.setTitle(`Leave Message`)
                    .setDescription(`Update the leave message with \`${currentPrefix}settings leave <message>\``)
                    .addField('Current message', `${message.guild.settings.get(message.guild.id, 'lm', 'None') !== 'None' ? `> ${message.guild.settings.get(message.guild.id, 'lm')}` : message.emotes.unchecked}`)
                    .addField('Placeholders', this.placeholders);
                return message.util.send(embed);
            }
            await message.guild.settings.set(message.guild.id, 'lm', msg);
            embed.setTitle(`Leave message updated`)
                    .setDescription(`✅ **Your leave message has been updated to**\n\`\`\`${msg}\`\`\``)
            return message.util.send(embed);
        }
    }
}

module.exports = WelcomeSettingsCommand;