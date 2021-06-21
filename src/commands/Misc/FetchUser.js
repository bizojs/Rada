const { Command } = require('discord-akairo');

class FetchUserCommand extends Command {
    constructor() {
        super('fetchuser', {
            aliases: ['fetchuser', 'fu'],
            category: 'Miscellaneous',
            description: {
              content: 'Fetch any user and show information about them.',
              permissions: ['EMBED_LINKS']  
            },
            args: [{
                id: 'id',
                type: 'string'
            }],
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec(message, args) {
        try {
            let fetched = await this.client.users.fetch(args.id);
            let user = this.client.users.cache.get(fetched.id);
            let mutualCount = this.client.guilds.cache.filter(g => g.members.cache.has(user.id)).map(g => g.name).length;
            let embed = this.client.util.embed()
                .setColor(this.client.color)
                .setURL(user.avatarURL() ? user.avatarURL({ size: 512, dynamic: true }).replace(/webm/g, 'gif').replace(/webp/g, 'png') : this.placeholder)
                .setAuthor(`${user.tag}`, user.bot ? 'https://cdn.discordapp.com/emojis/728596296243347486.png?v=1' : 'https://cdn.discordapp.com/emojis/556184052344946689.png?v=1')
                .setThumbnail(user.avatarURL() ? user.avatarURL({ size: 512, dynamic: true }).replace(/web?(m|p)/g, 'png') : this.placeholder)
                .setFooter(message.author.username)
                .setTimestamp()
                .addField('ID', args.id)
                if (user.displayFlags().length > 0) {
                    embed.addField(`${this.client.emojis.cache.get('856475335854784522')} Badges`, user.displayFlags())
                }
                embed.addField('Joined Discord', `${this.client.timeFormat('dddd d MMMM YYYY', user.createdAt)}`)
                .addField(`Mutual servers with ${this.client.user.username}`, mutualCount == 0 ? 'No mutual servers' : `Found ${mutualCount} mutual server${mutualCount > 1 ? 's' : ''}`)
            return message.util.send(embed);
        } catch (e) {
            return message.responder.error(`**Unable to fetch a user with the id \`${args.id}\`** \`(${e.message})\``)
        }
    }
}

module.exports = FetchUserCommand;