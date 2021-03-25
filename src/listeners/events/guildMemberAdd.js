const { Listener } = require('discord-akairo');

class GuildMemberAddListener extends Listener {
    constructor() {
        super('guildMemberAdd', {
            emitter: 'client',
            event: 'guildMemberAdd'
        });
    }

    async exec(member) {
        let channel = member.guild.settings.get(member.guild.id, 'wc', false);
        let message = member.guild.settings.get(member.guild.id, 'jm', false);
        let autorole = member.guild.roles.cache.get(member.guild.settings.get(member.guild.id, 'autorole', null));
        if (autorole && !member.roles.cache.has(autorole)) {
            await member.roles.add(autorole, 'Autorole');
        }
        if (channel && message) {
            message = message.replace(/{tag}/gi, member.user.tag);
            message = message.replace(/{user}/gi, member.user);
            message = message.replace(/{userid}/gi, member.user.id);
            message = message.replace(/{username}/gi, member.user.username);
            message = message.replace(/{membercount}/gi, member.guild.memberCount);
            message = message.replace(/{servername}/gi, member.guild.name);
            try {
                member.guild.channels.cache.get(channel).send(message);
            } catch (e) {
                if (e.message === 'Missing Permissions') this.client.users.cache.get(member.guild.owner.id)
                    .send(`I tried to send a message in ${member.guild.channels.cache.get(channel)} for a user joining, however i was missing permissions to do so.\nPlease check the permissions for my role/channel to make sure i have the required permissions.`)
                    .then(() => { })
                    .catch((err) => { return; })
            }
        }
    }
};
module.exports = GuildMemberAddListener;