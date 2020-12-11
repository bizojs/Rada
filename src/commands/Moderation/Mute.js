const { Command } = require('discord-akairo');
const { emotes } = require('../../../lib/constants');
const ms = require('ms');

module.exports = class MuteCommand extends Command {
    constructor() {
        super('mute', {
            aliases: ['mute', 'm', 'silence'],
            description: {
                content: '',
                permissions: ['MUTE_MEMBERS', 'MANAGE_ROLES']
            },
            args: [{
                id: 'member',
                type: 'member',
                default: null
            }, {
                id: 'duration',
                type: 'string',
                default: null
            }],
            userPermissions: ['MUTE_MEMBERS'],
            clientPermissions: ['MANAGE_ROLES']
        })
    }
    async exec(message, { member, duration, reason }) {
        if (!member) {
            return message.responder.error('**Please provide a user to mute**');
        }
        let muteRole = message.guild.roles.cache.find(r => r.name.toLowerCase().includes('muted'));
        if (member.id === message.author.id) {
            return message.responder.error('**You can\'t mute yourself**');
        }
        if (member.id === message.guild.me.id) {
            return message.responder.error('**I cannot be muted**');
        }
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return message.responder.error(`**You are unable to mute ${args.member.user.tag}**: \`Higher role\``);
        }
        if (muteRole && message.guild.me.roles.highest.position > message.guild.roles.cache.get(muteRole.id).position < 0) {
            return message.responder.error('**The mute role must be lower than my role**');
        }
        if (muteRole) await message.guild.settings.set(message.guild.id, 'muterole', muteRole.id);
        if (muteRole && member.roles.cache.has(muteRole.id)) {
            return message.responder.error(`**\`${member.user.tag} (${member.id})\` is already muted**`);
        }
        let text = muteRole ? '' : 'There is no mute role configured in this server, configuring now...';
        let completedText = muteRole ? '' : `~~There is no mute role configured in this server, configuring now...~~ ${emotes.success} **Mute role configured**\n\n`;
        let failedText = `~~There is no mute role configured in this server, configuring now...~~ ${emotes.error} **Failed to configure mute role**\n\n`;
        if (!muteRole) {
            await message.util.send(text);
            await message.guild.roles.create({
                data: {
                    name: 'Muted'
                },
                reason: `Mute role configured automatically by ${message.guild.me.user.tag}`
            }).then(async(role) => {
                await message.guild.settings.set(message.guild.id, 'muterole', role.id);
                message.guild.channels.cache.forEach(async (channel, id) => {
                    await channel.updateOverwrite(role, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    });
                });
                await message.util.send(completedText);
            }).catch(async(e) => {
                await message.util.send(`${failedText}${emotes.error} | \`${e.message}\``);
                return;
            })
        }
        let role = await message.guild.settings.get(message.guild.id, 'muterole');
        await member.roles.add(role);
        if (!duration) {
            await member.roles.add(role);
            await message.util.send(`${completedText}${emotes.success} | **Permanently muted** \`${member.user.tag} (${member.id})\``);
            return;
        }
        if (isNaN(ms(duration))) {
            return message.responder.error('**The mute duration you entered is invalid**');
        }
        if (ms(duration) < 1000) duration = '60s';
        let parsedTime = ms(duration, { long: true });
        let time = ms(parsedTime, { long: true });
        await message.util.send(`${completedText}${emotes.success} | **Muted** \`${member.user.tag} (${member.id})\` **for** \`${time}\``);
        await member.roles.add(role);
        setTimeout(async() => {
            if (member.roles.cache.has(role)) {
                await member.roles.remove(role)
                .then(async() => {
                    return message.channel.send(`${emotes.success} | **Automatically unmuted \`${member.user.tag} (${member.id})\` after being muted for \`${time}\`**`);
                })
                .catch((e) => {
                    return message.channel.send(`${emotes.error} | **Failed to automatically unmute** \`${member.user.tag} (${member.id})\` - ${e.message}`);
                })
            }
            return;
        }, ms(duration));
    }
}