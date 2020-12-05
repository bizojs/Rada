const { Command } = require('discord-akairo');
const req = require('@aero/centra');

module.exports = class extends Command {
    constructor() {
        super('hug', {
            aliases: ['hug'],
            category: 'Fun',
            description: {
                content: 'Give someone a nice hug',
                permissions: ["EMBED_LINKS"]
            },
            args: [{
                id: 'member',
                type: 'member',
                default: null
            }]
        })
    }
    async exec(message, { member }) {
        if (!member) return message.responder.error('**Please provide someone to hug**');
        try {
            const res = await req('https://api.ksoft.si/images/random-image?tag=hug', 'GET')
                .header('Authorization', `Bearer ${process.env.KSOFT}`)
                .json()
            return message.util.send({
                embed: this.client.util.embed()
                    .setTitle('Hug!')
                    .setDescription(`${message.author} has just given ${member.user} a big hug!`)
                    .setImage(res.url)
                    .setColor(this.client.color)
                    .setThumbnail(this.client.avatar)
                    .setTimestamp()
                });
        } catch (e) {
            return message.util.send(`${message.author} has just given ${member.user} a big hug!`);
        }
    }
}