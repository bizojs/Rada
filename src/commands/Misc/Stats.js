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
           }
        });
    }

    async exec(message) {
      const embed = this.client.util.embed()
        .setTitle('Statistics and information')
        .setColor(this.client.color)
        .setFooter(message.author.username)
        .setTimestamp()
        .setThumbnail(this.client.avatar)
        .setDescription(`Detailed information about ${this.client.user.username}'s hardware and other statistics`)
        .addField('Operating system', `${process.platform === 'linux' ? 'Ubuntu 18.04' : 'Windows 10'} ${process.arch}`)
        .addField('CPU', os.cpus()[0].model)
        .addField('Memory usage', `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) > 1024 ? `${(process.memoryUsage().heapUsed / 1024 / 1024 / 1024).toFixed(2)} GB` : `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`}\` used\n\`${(os.totalmem() / 1024 / 1024).toFixed(2) > 1024 ? `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB` : `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`}\` available`, true)
        .addField('CPU usage', `${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}%`, true)
        .addField('Users', `\`${this.client.guilds.cache.reduce((a, c) => a + c.memberCount, 0).toLocaleString()}\``)
        .addField('Guilds', `\`${(this.client.guilds.cache.size).toLocaleString()}\` guild${this.client.guilds.cache.size === 1 ? '' : 's'} (**${(this.client.channels.cache.size).toLocaleString()}** total channels)`)
      return message.util.send(embed);
    }
}

module.exports = StatsCommand;