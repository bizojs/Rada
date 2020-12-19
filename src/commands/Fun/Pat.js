const { Command } = require('discord-akairo');
const req = require('@aero/centra');

module.exports = class extends Command {
    constructor() {
        super('pat', {
            aliases: ['pat'],
            category: 'Fun',
            description: {
                content: 'Pat someone on the head',
                permissions: ["EMBED_LINKS"]
            },
            args: [{
                id: 'member',
                type: 'member',
                default: null
            }],
            clientPermissions: ['EMBED_LINKS']
        })
    }
    async exec(message, { member }) {
        if (!member) return message.responder.error('**Please provide someone to pat**');
        try {
            const res = await req('https://api.ksoft.si/images/random-image?tag=pat', 'GET')
                .header('Authorization', `Bearer ${process.env.KSOFT}`)
                .json()
            return message.util.send({
                embed: this.client.util.embed()
                    .setTitle('Pat!')
                    .setDescription(`${message.author} has just given ${member.user} a pat on the head!`)
                    .setImage(res.url)
                    .setColor(this.client.color)
                    .setThumbnail(this.client.avatar)
                    .setTimestamp()
                });
        } catch (e) {
            return message.util.send(`${message.author} has just given ${member.user} a pat on the head!`);
        }
    }
}