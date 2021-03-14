const { color: { POSITIVE, VERY_NEGATIVE } } = require('../../../lib/constants');
const { Command } = require('discord-akairo');
const req = require('@aero/centra');

class MCStatusCommand extends Command {
    constructor() {
        super('mcstatus', {
            aliases: ['mcstatus', 'minecraftstatus', 'mcs'],
            category: 'Miscellaneous',
            description: {
                content: 'Fetch the status of a minecraft server',
                permissions: ['EMBED_LINKS']
            },
            args: [{
                id: 'ip',
                type: 'string'
            }],
            cooldown: 60000,
            ratelimit: 1,
            clientPermissions: ['EMBED_LINKS']
        });
        this.default = 'https://i.br4d.vip/CyDFzDrI.png';
        this.error_responses = [
            'Unexpected token < in JSON at position 0',
            'Unexpected token P in JSON at position 0'
        ];
    }

    async exec(message, args) {
        if (!args.ip) {
            return message.responder.error('Provide an IP or server address');
        }
        let ip = args.ip;
        let a = message.util.send('**Loading status...** This may take a little while.');
        try {
            const more_data = await req(`https://mcapi.us/server/query?ip=${ip}`, 'GET').json();
            const data = await req('https://api.mcsrvstat.us/2', 'GET')
                .path(ip)
                .json()
            const icon = await req('https://eu.mc-api.net/v3/server/favicon', 'GET')
                .path(ip)
                .text()
            const embed = this.client.util.embed()
                .setTitle(`${data.online ? data.hostname : ip} status`)
                .setThumbnail(icon.toLowerCase() !== 'ping failed' ? `https://eu.mc-api.net/v3/server/favicon/${ip}` : this.default)
                .setDescription(data.online ? data.motd.clean.join('\n').replace(/❑/g, '**') : '')
                .setColor(data.online ? POSITIVE : VERY_NEGATIVE)
                .addField('Info', data.online ? 'Online' : 'This server is currently offline. Please check back later', true)
                .setTimestamp()
            if (data.online) {
                embed.addField('Players', data.players.online + '/' + data.players.max, true)
                embed.setFooter(`${data.hostname} - ${data.version}`)
            }
            if (more_data.plugins !== null && more_data.status !== 'error') {
                let plugins = [];
                more_data.plugins.forEach(p => plugins.push(p.split(' ')[0]));
                embed.addField('Server type', `**${more_data.game_type}** - ${more_data.server_mod}`)
                embed.addField('Plugins', plugins.join(', '), true)
                if (data.players.online > 0) {
                    embed.addField('Online players', more_data.players.list.join(', '))
                }
            }
            await a.then(async(m) => { await m.edit('', embed) });
        } catch (e) {
            if (this.error_responses.some(error => error === e.message)) {
                await a.then(async(m) => { await m.edit(`There are issues with the API. Please check back later.`) });
                return;
            }
            if (e.message === "Unexpected token T in JSON at position 4") {
                await a.then(async(m) => { await m.edit(`:x: Server \`${ip}\` not found`) });
                return;
            }
            if (e.message === "Unexpected end of JSON input") {
                await a.then(async(m) => { await m.edit(`:x: Server \`${ip}\` not found`) });
                return;
            }
            await a.then(async(m) => { await m.edit(`An error occured: \`${e.message}\``) });
        }
    }
}

module.exports = MCStatusCommand;