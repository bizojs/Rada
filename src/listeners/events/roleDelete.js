const { Listener } = require('discord-akairo');

module.exports = class roleDelete extends Listener {
    constructor() {
        super('roleDelete', {
            emitter: 'client',
            event: 'roleDelete',
        })
    }
    async exec(role) {
        let muterole = await role.guild.settings.get(role.guild.id, 'muterole', null);
        if (muterole && role.id === muterole) {
            await role.guild.settings.reset('muterole');
        }
    }
}