const { Command } = require('discord-akairo');
const req = require('@aero/centra');

module.exports = class GroupHugCommand extends Command {
    constructor() {
        super('grouphug', {
            aliases: ['grouphug', 'ghug'],
            category: 'Fun',
            description: {
                content: 'Give a few friends a nice hug. @Mention all users you want to hug',
                permissions: ["EMBED_LINKS"]
            },
            clientPermissions: ['EMBED_LINKS']
        })
    }
    async exec(message) {
        let users = message.mentions.users;
        if (users.size < 1) {
            return message.responder.error('**Provide at least 1 user to hug**');
        }
        let formatted = users.size > 1 ?
            users.map(user => user.toString()).join(' ').split(' ', users.size - 1).join(', ') + ' and ' + users.map(user => user.toString())[users.size-1] :
            users.first().toString();
        try {
            const res = await req('https://api.ksoft.si/images/random-image?tag=hug', 'GET')
                .header('Authorization', `Bearer ${process.env.KSOFT}`)
                .json()
            let embed = this.client.util.embed()
                .setTitle('Group Hug!')
                .setDescription(`**${message.author}** has just given **${formatted}** a hug!`)
                .setColor(this.client.color)
                .setImage(res.url)
                .setThumbnail(this.client.avatar)
                .setTimestamp()
            return message.util.send(embed)
        } catch (e) {
            return message.util.send(`**${message.author}** has just given **${formatted}** a hug!`);
        }
    }
}