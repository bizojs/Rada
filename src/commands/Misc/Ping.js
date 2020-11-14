const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class PingCommand extends Command {
    constructor() {
        super('ping', {
           aliases: ['ping'],
           category: 'Miscellaneous',
           description: 'The bots connection to discord.'
        });
    }

    async exec(message) {
        const sent = await message.util.send('Pinging...');
        const timeDiff = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt);
    	const embed = new MessageEmbed()
    		.setTitle(`${this.client.user.username} ping`)
	    	.setDescription([
	            `🔂 **RTT**: ${timeDiff} ms`,
	            `💟 **Heartbeat**: ${Math.round(this.client.ws.ping)} ms`
	        ])
	    	.setColor(this.client.color)
	    	.setFooter(`Requested by ${message.author.username}`)
	    	.setTimestamp();
    	message.util.send('', embed);
    }
}

module.exports = PingCommand;