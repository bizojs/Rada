const { Command } = require('discord-akairo');
const { MessageCollector } = require('discord.js');

class KickCommand extends Command {
    constructor() {
      super('kick', {
        aliases: ['kick', 'k', 'boot'],
        category: 'Moderation',
        description: {
            content: 'Kick a user from the server with an optional reason.',
            permissions: ['KICK_MEMBERS']
        },
        args: [{
          id: 'member',
          type: 'member',
          default: null
        }, {
          id: 'reason',
          type: 'string',
          match: 'rest',
          default: 'No reason provided',
        }],
        userPermissions: ['KICK_MEMBERS'],
        clientPermissions: ['KICK_MEMBERS']
      });
    }

    async exec(message, args) {
        if (!args.member) {
            return message.responder.error('**Please provide a valid user to kick**');
        }
        
        if (!args.member.kickable) {
            return message.responder.error(`**I am unable to kick ${args.member.user.tag}**`);
        }
        if (message.member.roles.highest.comparePositionTo(args.member.roles.highest) <= 0) {
            return message.responder.error(`**You are unable to kick ${args.member.user.tag}**: \`Higher role\``);
        }
        let m = message.responder.info(`\`[⏱️20s]\` **Are you sure you want to kick \`${args.member.user.tag} [${args.member.id}]\`** (y/n)`);
        
        const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, {
            time: 20000
        });
        collector.on('collect', msg => {
            switch (msg.content) {
                case "y":
                    msg.delete()
                    args.member.kick(`Kicked by: ${message.member.user.tag} - Reason: ${args.reason}.`)
                        .then(() => {
                            collector.stop('success');
                            return message.responder.success(`**Kicked \`${args.member.user.tag} (${args.member.id})\`**`)
                        }).catch(err => {
                            collector.stop('success');
                            if (err) return message.responder.error(`**Encountered an error:** \`${err}\``)
                        });
                        /**
                        if (logs) {
                            return logs.send({
                                embed: new MessageEmbed()
                                    .setColor(this.client.embedColor())
                                    .setTitle(`Moderation action - **Ban**`)
                                    .setDescription(`**${member.tag}** Has been banned from the server\nModerator: \`${message.author.tag}\`\nBan reason: \`\"${reason}\"\``)
                            });
                        };
                        */
                    break;
                case "n":
                    msg.delete()
                    message.responder.success('**Cancelled**');
                    collector.stop('success');
                break
                default:
                    message.responder.success('**Cancelled**');
                    collector.stop('success');
                break;
            };
            collector.stop('success');
        });
        collector.on('end', (ignore, error) => {
            if (error && error !== "success") {
                return message.responder.info('**Timed out**');
            };
            collector.stop('success');
        });
    }
}

module.exports = KickCommand;