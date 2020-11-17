const { color: { POSITIVE, VERY_NEGATIVE } } = require('../../../lib/constants');
const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const req = require('@aero/centra');

class NpmCommand extends Command {
    constructor() {
        super('npm', {
           aliases: ['npm', 'npmjs'],
           category: 'Miscellaneous',
           description: {
             content: 'Fetch information about an npm package',
             permissions: ['EMBED_LINKS']  
           },
           args: [{
              id: 'package',
              type: 'string'
           }]
        });
        this.npmIcon = 'https://i.br4d.vip/Q5Ql1P45.png';
    }

    async exec(message, args) {
        let pkg = args.package;
        if (!pkg) {
            return message.channel.send('Please enter the name of an npm package');
        }
        let query = pkg;
        let searching = message.channel.send(`Searching NPMjs for \`${pkg}\`...`);
        try {
            const body = await req(`https://registry.npmjs.com/${query.toLowerCase()}`, 'GET').json()
            const version = body.versions[body['dist-tags'].latest];
            let deps = version.dependencies ? Object.keys(version.dependencies) : null;
            let maintainers = body.maintainers.map(user => user.name)

            if (maintainers.length > 10) {
                const len = maintainers.length - 10;
                maintainers = maintainers.slice(0, 10);
                maintainers.push(`... and more.`);
            }
            if (deps && deps.length > 10) {
                const len = deps.len - 10;
                deps = deps.slice(0, 10);
                deps.push(`... and more.`)
            }
            let embed = new MessageEmbed()
                .setColor(this.client.color)
                .setTitle(`**${body.name}** Npm package information`)
                .setThumbnail(this.npmIcon)
                .addField(`Package Description`, `${version.description || "No description provided."}`)
                .addField(`Package Version`, `${body['dist-tags'].latest}`, true)
                .addField(`Package License`, `${body.license}`, true)
                .addField(`Package Maintainers`, `${maintainers.join(", ")}`, true)
                .addField(`Dependencies`, `${deps && deps.length ? deps.join(", ") : "None"}`, false)
                .addField(`Link`, `https://www.npmjs.com/package/${query.toLowerCase()}`)
                .setFooter(`Requested by ${message.author.username}`)
                .setTimestamp()
            searching.then(async(msg) => {
                msg.edit('', embed);
            })
        } catch (error) {
            let embed = new MessageEmbed()
                .setTitle('Npm package information')
                .setColor(this.client.color)
                .setThumbnail(this.npmIcon)
                .setDescription(`**Couldn\'t find any results for** \`${pkg}\``)
                .setFooter(`Requested by ${message.author.username}`)
                .setTimestamp()
            searching.then(async(msg) => {
                msg.edit('', embed);
            })
        }
    }
}

module.exports = NpmCommand;