const { Command } = require('discord-akairo');
const req = require('@aero/centra');

module.exports = class extends Command {
    constructor() {
        super('kiss', {
            aliases: ['kiss'],
            category: 'Fun',
            description: {
                content: 'Give someone a kiss',
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
        if (!member) return message.responder.error('**Please provide someone to kiss**');
        try {
            const res = await req('https://api.ksoft.si/images/random-image?tag=kiss', 'GET')
                .header('Authorization', `Bearer ${process.env.KSOFT}`)
                .json()
            return message.util.send({
                embed: this.client.util.embed()
                    .setTitle('Kiss!')
                    .setDescription(`${message.author} has just given ${member.user} a kiss!`)
                    .setImage(res.url)
                    .setColor(this.client.color)
                    .setThumbnail(this.client.avatar)
                    .setTimestamp()
                });
        } catch (e) {
            return message.util.send(`${message.author} has just given ${member.user} a kiss!`);
        }
    }
}