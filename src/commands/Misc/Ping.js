const { Command } = require('discord-akairo');

class PingCommand extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping'],
            category: 'Miscellaneous',
            description: {
                content: 'The bots connection to discord.',
                permissions: ['EMBED_LINKS']
            },
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec(message) {
        const sent = await message.util.send('Pinging...');
        const timeDiff = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt);
    	const embed = this.client.util.embed()
        .setThumbnail(this.client.avatar)
    		.setTitle(`${this.client.user.username} ping`)
	    	.setDescription([
	            `🔂 **RTT**: ${timeDiff} ms`,
	            `💟 **Heartbeat**: ${Math.round(this.client.ws.ping)} ms`
	        ].join('\n'))
	    	.setColor(this.client.color)
	    	.setFooter(`Requested by ${message.author.username}`)
	    	.setTimestamp();
    	message.util.send('', embed);
    }
}

module.exports = PingCommand;