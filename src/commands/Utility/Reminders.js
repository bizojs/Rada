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
                id: 'reminderId',
                type: 'string',
                default: null
            }, {
                id: 'duration',
                type: 'string',
                default: null
            }, {
                id: 'start',
                match: 'flag',
                flag: '--start'
            }, {
                id: 'clear',
                match: 'flag',
                flag: '--clear'
            }]
        });
    }

    async exec(message, { reminderId, duration, start, clear }) {
        let history = new ReminderHistory(message.author);
        history.populate(); // This is required to populate data
        let reminders = message.author.reminders.current;
        let past = message.author.reminders.old;
        // If the --clear flag was detected
        if (clear) {
            this.client.RadaReminder.clear(message.author);
            this.client.RadaReminder.clearSaved(message.author);
            return message.responder.success('**Your reminders have been cleared**');
        } else {
            // If a reminder number is entered
            if (reminderId) {
                let selected = past[reminderId - 1];
                if (!selected || isNaN(reminderId)) {
                    return message.responder.error('Please provide a valid reminder number');
                }
                // If the --start flag was detected
                if (start) {
                    if (!duration || !ms(duration)) {
                        return message.responder.error('**Please provide a valid time** (Example: \`5h\`, \`1d\`, \`30m\`)')
                    }
                    let current = ms(ms(duration), { long: true });
                    let date = new Date(Date.now() + ms(duration));
                    let reminderEmbed = this.client.util.embed()
                        .setColor(this.client.color)
                        .setThumbnail(this.client.avatar)
                        .setTitle('Reminder')
                    await this.client.RadaReminder.create(date, message, selected.message, reminderEmbed, current);
                    return message.responder.success(`Reminder re-activated, you will be reminded in \`${current}\``);
                }
                // Only reminder number was inputted
                let reminderInfoEmbed = this.client.util.embed()
                    .setTitle(`Reminder Info - #${reminderId}`)
                    .setColor(this.client.color)
                    .setThumbnail(this.client.avatar)
                    .setDescription(this.client.Util.quote(this.client.Util.trimString(selected.message, 2020)))
                    .addField('Use this reminder again', `To use this reminder again, simply add the flag \`--start\` to your current message and a new time (Example: \`${message.content} --start 2h\`)`)
                    .setTimestamp(selected.duration)
                return message.util.send(reminderInfoEmbed)
            }
            // No args inputted, shows all reminders
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
