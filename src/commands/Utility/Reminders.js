const { Command } = require('discord-akairo');
const ms = require('ms');
const ReminderHistory = require('../../../lib/classes/RadaReminderHistory');
module.exports = class RemindersCommand extends Command {
    constructor() {
        super('reminders', {
            aliases: ['reminders', 'rms'],
            category: 'Utility',
            description: {
                content: 'View your reminders, if any exist.',
                permissions: []
            },
            clientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS'],
            args: [{
                id: 'clear',
                match: 'flag',
                flag: '--clear'
            }]
        });
    }

    async exec(message, { clear }) {
        let history = new ReminderHistory(message.author);
        history.populate(); // This is required to populate data
        let reminders = message.author.reminders.current;
        let past = message.author.reminders.old;
        if (clear) {
            this.client.RadaReminder.clear(message.author);
            this.client.RadaReminder.clearSaved(message.author);
            return message.responder.success('**Your reminders have been cleared**');
        } else {
            let embed = this.client.util.embed()
                .setTitle('Reminders')
                .setColor(this.client.color)
                .setThumbnail(this.client.avatar)
                .setDescription('Show any of your active reminders and up to 5 previous reminders. You can clear all your reminders by using the flag \`--clear\`')
                .addField('Active', reminders.length > 0 ? reminders.map((reminder, index) => `\`#${index+1}\` - Reminding you in \`${ms(reminder.duration - Date.now())}\`\n> **${this.client.Util.trimString(reminder.message, 120)}**`).join('\n') : "None")
                .addField('History', past.length > 0 ? past.map((reminder, index) => `\`#${index+1}\` - Reminded on \`${reminder.duration.toLocaleString()}\`\n> **${this.client.Util.trimString(reminder.message, 120)}**`).join('\n') : "None")
            return message.reply(embed);
        }
    }
}
