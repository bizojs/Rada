const { Command } = require('discord-akairo');
const { MessageCollector } = require('discord.js');

class BanCommand extends Command {
    constructor() {
      super('ban', {
        aliases: ['ban', 'b'],
        category: 'Moderation',
        description: {
            content: 'Ban a user from the server with an optional reason.',
            permissions: ['BAN_MEMBERS']
        },
        args: [{
          id: 'member',
          type: 'member',
          default: null
        },
        {
          id: 'reason',
          type: 'string',
          match: 'rest',
          default: 'No reason provided',
        }],
        userPermissions: ['BAN_MEMBERS'],
        clientPermissions: ['BAN_MEMBERS']
      });
    }

    async exec(message, args) {
        if (!args.member) {
            return message.responder.error('**Please provide a valid user to ban**');
        }
        
        if (!args.member.bannable) {
            return message.responder.error(`**I am unable to ban ${args.member.user.tag}**`);
        }
        if (message.member.roles.highest.comparePositionTo(args.member.roles.highest) <= 0) {
            return message.responder.error(`**You are unable to ban ${args.member.user.tag}**: \`Higher role\``);
        }
        let m = message.responder.info(`\`[⏱️20s]\` **Are you sure you want to ban \`${args.member.user.tag} [${args.member.id}]\`** (y/n)`);
        
        const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, {
            time: 20000
        });
        collector.on('collect', msg => {
            switch (msg.content) {
                case "y":
                    args.member.ban({days: 0, reason: `Banned by: ${message.member.user.tag} - Reason: ${args.reason}.`})
                        .then(() => {
                            collector.stop('success');
                            return message.responder.success(`**Banned \`${args.member.user.tag} (${args.member.id})\`**`)
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

module.exports = BanCommand;