const { Command } = require('discord-akairo');
const req = require('@aero/centra');

module.exports = class extends Command {
    constructor() {
        super('tickle', {
            aliases: ['tickle'],
            category: 'Fun',
            description: {
                content: 'Tickle someone',
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
        if (!member) return message.responder.error('**Please provide someone to tickle**');
        try {
            const res = await req('https://api.ksoft.si/images/random-image?tag=tickle', 'GET')
                .header('Authorization', `Bearer ${process.env.KSOFT}`)
                .json()
            return message.util.send({
                embed: this.client.util.embed()
                    .setTitle('Tickle!')
                    .setDescription(`${message.author} has just tickled ${member.user}`)
                    .setImage(res.url)
                    .setColor(this.client.color)
                    .setThumbnail(this.client.avatar)
                    .setTimestamp()
                });
        } catch (e) {
            return message.util.send(`${message.author} has just tickled ${member.user}`);
        }
    }
}