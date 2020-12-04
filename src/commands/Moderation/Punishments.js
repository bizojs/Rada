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
            let embeds = [];
            for (let i = 0; i < infractionsArray.length; i ++) {
                let embed = this.client.util.embed()
                    .setTitle(`Infractions for ${args.member.user.username}`)
                    .setColor(this.client.color)
                    .setThumbnail(args.member.user.avatarURL({size: 512}).replace('webp', 'png').replace('webm', 'gif'))
                    .addField(infractionsTitle[i], infractionsArray[i])
                    .setTimestamp()
                embeds.push(embed)
            }
            message.paginate(embeds);
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