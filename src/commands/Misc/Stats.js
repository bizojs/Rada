const { Command } = require('discord-akairo');
const os = require('os');
const osUtil = require('node-os-utils');

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
      let cpuUsage = await osUtil.cpu.usage();
      let opSys = await osUtil.os.oos();
      const embed = this.client.util.embed()
        .setTitle('Statistics and information')
        .setColor(this.client.color)
        .setFooter(message.author.username)
        .setTimestamp()
        .setThumbnail(this.client.avatar)
        .setDescription(`Detailed information about ${this.client.user.username}'s hardware and other statistics`)
        .addField('Operating system', `${opSys === 'not supported' ? 'Windows 10 Home' : opSys} ${osUtil.os.arch()}`)
        .addField('CPU', osUtil.cpu.model())
        .addField('Memory usage', `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) > 1024 ? `${(process.memoryUsage().heapUsed / 1024 / 1024 / 1024).toFixed(2)} GB` : `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`}\` used\n\`${(os.totalmem() / 1024 / 1024).toFixed(2) > 1024 ? `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB` : `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`}\` available`, true)
        .addField('CPU usage', `\`${cpuUsage}%\``, true)
        .addField('Users', `\`${this.client.users.cache.size.toLocaleString()}\``)
        .addField('Guilds', `\`${(this.client.guilds.cache.size).toLocaleString()}\` guild${this.client.guilds.cache.size === 1 ? '' : 's'} (**${(this.client.channels.cache.size).toLocaleString()}** total channels)`)
      return message.util.send(embed);
    }
}

module.exports = StatsCommand;
