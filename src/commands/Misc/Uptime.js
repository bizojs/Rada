const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class UptimeCommand extends Command {
    constructor() {
        super('uptime', {
           aliases: ['uptime'],
           category: 'Miscellaneous',
           description: {
               content: 'See how long the bot has been online for.',
               permissions: ['EMBED_LINKS']
           }
        });
    }

    async exec(message) {
        const embed = new MessageEmbed()
            .setTitle(`${this.client.user.username} uptime`)
            .setThumbnail(this.client.avatar)
            .setColor(this.client.color)
            .setDescription(`I have been online for\n${this.client.convertMs(this.client.uptime)}`)
            .setFooter(`Requested by ${message.author.username}`)
            .setTimestamp()
        return message.channel.send(embed);
    }
}

module.exports = UptimeCommand;