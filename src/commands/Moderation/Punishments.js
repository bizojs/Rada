const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class PunishmentsCommand extends Command {
    constructor() {
      super('punishments', {
        aliases: ['punishments', 'infractions'],
        category: 'Moderation',
        description: {
            content: 'View the infractions that a user has',
            permissions: ['EMBED_MESSAGES']
        },
        args: [{
            id: 'member',
            type: 'member',
            default: message => message.member
        },
        {
            id: 'clear',
            type: 'clear',
            default: null
        }],
      });
    }

    async exec(message, args) {
        if (!args.clear) {
            // Preparing for d.js messageReactionAdd fix for pagination
            /**
                let infractionsArray = [
                    args.member.settings.get(args.member.id, 'punishments.kick', 'No infractions'),
                    args.member.settings.get(args.member.id, 'punishments.ban', 'No infractions'),
                    args.member.settings.get(args.member.id, 'punishments.mute', 'No infractions'),
                    args.member.settings.get(args.member.id, 'punishments.warn', 'No infractions')
                ];
                let infractionsTitle = [
                    `Kicks (${args.member.settings.get(args.member.id, 'punishments.kick', []).length})`,
                    `Bans (${args.member.settings.get(args.member.id, 'punishments.ban', []).length})`,
                    `Mutes (${args.member.settings.get(args.member.id, 'punishments.mute', []).length})`,
                    `Warns (${args.member.settings.get(args.member.id, 'punishments.warn', []).length})`
                ];
                let embed = [];
                for (let i = 0; i < infractionsArray.length; i ++) {
                    let embed = new MessageEmbed()
                        .setTitle(`Infractions for ${args.member.user.username}`)
                        .setColor(this.client.color)
                        .setThumbnail(this.client.avatar)
                        .addField(infractionsTitle[i], infractionsArray[i])
                        .setFooter(`Page ${i+1} of ${pages.length} | Requested by ${message.author.username}`)
                        .setTimestamp()
                    embeds.push(embed)
                }
                message.paginate(embeds, 12000);
            */
            let embed = new MessageEmbed()
                .setTitle(`Infractions for ${args.member.user.username}`)
                .setColor(this.client.color)
                .setThumbnail(this.client.avatar)
                .addField(`Kicks (${args.member.settings.get(args.member.id, 'punishments.kick', []).length})`, args.member.settings.get(args.member.id, 'punishments.kick', 'No infractions'))
                .addField(`Bans (${args.member.settings.get(args.member.id, 'punishments.ban', []).length})`, args.member.settings.get(args.member.id, 'punishments.ban', 'No infractions'))
                .addField(`Mutes (${args.member.settings.get(args.member.id, 'punishments.mute', []).length})`, args.member.settings.get(args.member.id, 'punishments.mute', 'No infractions'))
                .addField(`Warns (${args.member.settings.get(args.member.id, 'punishments.warn', []).length})`, args.member.settings.get(args.member.id, 'punishments.warn', 'No infractions'))
                .setFooter(`Requested by ${message.author.username}`)
                .setTimestamp()
            return message.channel.send(embed);
        } else {
            if (!message.member.permissions.has('MANAGE_GUILD')) {
                return message.responder.error('**You must have the manage server permission to clear infractions**');
            }
            args.member.settings.clearInfractions();
            return message.responder.success(`**All the infractions for \`${args.member.user.tag}\` have been cleared**`);
        }
    }
}

module.exports = PunishmentsCommand;