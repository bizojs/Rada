const { Command } = require('discord-akairo');
const { MessageEmbed, MessageAttachment } = require('discord.js');

class FetchUserCommand extends Command {
    constructor() {
        super('fetchuser', {
            aliases: ['fetchuser', 'fu'],
            category: 'Miscellaneous',
            description: 'Fetch any user and show information about them.',
            args: [{
                id: 'id',
                type: 'string'
            }]
        });
    }

    async exec(message, args) {
        try {
            let fetched = await this.client.users.fetch(args.id);
            // console.log(fetched)
            let user = this.client.users.cache.get(fetched.id);
            console.log(user)
            let mutualCount = this.client.guilds.cache.filter(g => g.members.cache.has(user.id)).map(g => g.name).length;
            let embed = new MessageEmbed()
                .setColor(this.client.color)
                .setURL(user.avatarURL() ? user.avatarURL({ size: 512, dynamic: true }).replace(/web?(m|p)/g, 'png') : this.placeholder)
                .setAuthor(`${user.tag}`, user.bot ? 'https://cdn.discordapp.com/emojis/728596296243347486.png?v=1' : 'https://cdn.discordapp.com/emojis/556184052344946689.png?v=1')
                .setThumbnail(user.avatarURL() ? user.avatarURL({ size: 512, dynamic: true }).replace(/web?(m|p)/g, 'png') : this.placeholder)
                .setFooter(message.author.username)
                .setTimestamp()
                .addField('ID', args.id)
                .addField('Joined Discord', `${this.client.timeFormat('dddd d MMMM YYYY', user.createdAt)}`)
                .addField(`Mutual servers with ${this.client.user.username}`, mutualCount == 0 ? 'No mutual servers' : `Found ${mutualCount} mutual server${mutualCount > 1 ? 's' : ''}`)
            return message.channel.send(embed);
        } catch (e) {
            return message.channel.send(`**Unable to fetch a user with the id \`${args.id}\`** \`(${e.message})\``)
        }
    }
}

module.exports = FetchUserCommand;