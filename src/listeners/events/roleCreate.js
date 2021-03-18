const { Listener } = require('discord-akairo');

module.exports = class roleCreate extends Listener {
    constructor() {
        super('roleCreate', {
            emitter: 'client',
            event: 'roleCreate',
        })
    }
    async exec(role) {
        let RoleCreateEmote = this.client.emojis.cache.find(e => e.name === "role_create");
        let logs = role.guild.channels.cache.get(role.guild.settings.get(role.guild.id, 'logs'));
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setAuthor('Role created', RoleCreateEmote.url)
            .addField('Name', role.name, true)
            .addField('ID', role.id, true)
            .setTimestamp()
        if (logs) {
            logs.send(embed)
        }
    }
}