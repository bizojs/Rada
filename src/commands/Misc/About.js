const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class AboutCommand extends Command {
    constructor() {
        super('about', {
           aliases: ['about', 'info'],
           category: 'Miscellaneous',
           description: 'Displays information about Rada.'
        });
    }

    async exec(message) {
      const embed = new MessageEmbed()
        .setColor(this.client.color)
        .setTitle(`${this.client.user.username} information`)
        .addField('Created by', `\`${this.client.users.cache.get(this.client.ownerID[0]).tag} (${this.client.ownerID[0]})\``)
        .addField('Language', '[NodeJS](https://nodejs.org/en/) ([discord.js](https://discord.js.org/#/))')
        .addField('Framework', '[discord-akairo](https://discord-akairo.github.io/#/)')
        .addField('What does \'Rada\' mean', 'Rada originates in Slavic languages and means "filled with care". As a feminine given name it is used in Slavic languages, mainly Russian, in the United States it is very rare.')
        .setFooter(`Requested by ${message.author.username}`)
        .setTimestamp()
      return message.channel.send(embed);
    }
}

module.exports = AboutCommand;