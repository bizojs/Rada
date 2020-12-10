const { Command } = require('discord-akairo');
const { MessageCollector } = require('discord.js');

class BanCommand extends Command {
    constructor() {
      super('softban', {
        aliases: ['softban', 'sb'],
        category: 'Moderation',
        description: {
            content: 'Ban a user from the server then unban them. Think of it as a kick but to also remove messages.',
            permissions: ['BAN_MEMBERS']
        },
        args: [{
          id: 'member',
          type: 'member',
          default: null
        },{
            id: 'reason',
            type: 'string',
            match: 'rest',
            default: null
        }],
      });
    }
    userPermissions(message) {
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.responder.error('**You require the ban members permission to use this command**');
        }
        return null;
    }
    clientPermissions(message) {
        if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
            return message.responder.error('**I require the ban members permission to use this command**');
        }
        return null;
    }

    async exec(message, { member, reason }) {
        if (!member) {
            return message.responder.error('**Please provide a valid user to softban**');
        }
        if (!member.bannable) {
            return message.responder.error(`**I am unable to softban ${args.member.user.tag}**`);
        }
        if (message.member.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
            return message.responder.error(`**You are unable to softban ${member.user.tag}**: \`Higher role\``);
        }
        let m = message.responder.info(`\`[⏱️20s]\` **Are you sure you want to softban \`${member.user.tag} [${member.id}]\`** (y/n)`);
        
        const collector = new MessageCollector(message.channel, m => m.author.id === message.author.id, {
            time: 20000
        });
        collector.on('collect', msg => {
            switch (msg.content) {
                case "y":
                    member.ban({days: 7, reason: `Softbanned by: ${message.member.user.tag} - Reason: ${reason ? reason : 'Not provided'}`})
                        .then(async() => {
                            collector.stop('success');
                            await message.guild.members.unban(member.user.id);
                            return message.responder.success(`**Softbanned \`${member.user.tag} (${member.id})\`**`)
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