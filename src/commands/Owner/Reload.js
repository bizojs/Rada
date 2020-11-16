const { Command } = require('discord-akairo');

class ReloadCommand extends Command {
    constructor() {
        super('reload', {
            aliases: ['reload'],
            description: 'Reloads a singular command or all commands.',
            args: [{
                id: 'commandID'
            }],
            ownerOnly: true,
            category: 'Owner'
        });
    }

    exec(message, args) {
        if (args.commandID === 'all') {
            this.handler.reloadAll(); 
            return message.responder.success('**Successfully reloaded all commands**')
        }
        this.handler.reload(args.commandID);
        return message.responder.success(`**Successfully reloaded command** \`${args.commandID}\``);
    }
}

module.exports = ReloadCommand;