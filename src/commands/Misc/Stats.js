const { Command } = require('discord-akairo');
const os = require('os');

class StatsCommand extends Command {
    constructor() {
        super('stats', {
            aliases: ['stats'],
            category: 'Miscellaneous',
            description: {
                content: 'Statistics of the bot.',
                permissions: ['EMBED_LINKS']
            },
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec(message) {
            let total = this.client.guilds.cache.reduce((a, c) => a + c.memberCount, 0);
            let cached = this.client.guilds.cache.reduce((a, c) => a + c.members.cache.size, 0);
            let percent = (cached / total * 100).toFixed(0) + '%';
            const embed = this.client.util.embed()
                .setTitle('Statistics and information')
                .setColor(this.client.color)
                .setFooter(message.author.username)
                .setTimestamp()
                .setThumbnail(this.client.avatar)
                .setDescription(`Detailed information about ${this.client.user.username}'s hardware and other statistics`)
                .addField('Operating system', `${process.platform === 'linux' ? 'Ubuntu 18.04' : 'Windows 10'} ${process.arch}`)
                .addField('CPU', os.cpus()[0].model)
                .addField('Memory', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) > 1024 ? `${(process.memoryUsage().heapUsed / 1024 / 1024 / 1024).toFixed(2)} GB` : `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`} / ${(os.totalmem() / 1024 / 1024).toFixed(2) > 1024 ? `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB` : `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`}`, true)
                .addField('CPU', `${os.loadavg()[0].toFixed(1)}%`, true)
                .addField('Bot stats', `Users: ${(total).toLocaleString()} total, ${(cached).toLocaleString()} cached (**${percent}**)\nGuilds: ${(this.client.guilds.cache.size).toLocaleString()}`)
      return message.util.send(embed);
    }
}

module.exports = StatsCommand;