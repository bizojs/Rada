const { Command } = require('discord-akairo');
const ms = require('ms');

module.exports = class RemindersCommand extends Command {
    constructor() {
        super('reminders', {
            aliases: ['reminders', 'rms'],
            category: 'Utility',
            description: {
                content: 'View your reminders, if any exist.'
            },
            clientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS', 'MANAGE_MESSAGES']
        });
    }

    async exec(message) {
        let reminders = message.author.reminders.current;
        let field = "";
        for (let r = 0; reminders.length > r; r++) {
            let reminder = reminders[r];
            field += `${r+1} - **${reminder.message}** (Reminding you in ${ms(reminder.duration - Date.now())})\n`
        }
       await message.channel.send(field)
    }
}
