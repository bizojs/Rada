const schedule = require('cron');
const ReminderHistory = require('./RadaReminderHistory');
const RadaReminder = require('./RadaReminder');

class RadaScheduler {

    constructor(client) {
        this.client = client;
    }

    create(date, message, reminder, embed, duration) {
        let reminderData = new RadaReminder(date, reminder, message.author.id);
        message.author.reminders.current.push(reminderData)
        new schedule.CronJob(date, () => {
            let old = new ReminderHistory(message.author);
            this.delete(message.author, date, reminder);
            old.store(reminderData);
            message.author.send(embed.setDescription(`You asked me \`${duration}\` ago to remind you of the following:\n\n${this.client.Util.trimString(reminder, 1800)}`)).catch(() => {
                message.channel.send(message.author, embed.setDescription(`I tried to DM you your reminder, but I was unable to.\n\nYou asked me \`${duration}\` ago to remind you of the following: **${this.client.Util.trimString(reminder, 1800)}**`));
            })
        }).start();
    }

    delete(author, start, reminder) {
        let current = author.reminders.current;
        let data = new RadaReminder(start, reminder, author.id);
        current.splice(current.indexOf(data), 1);
    }

    clear(author) {
        author.reminders.current = [];
    }

    clearSaved(author) {
        author.reminders.old = [];
        let db = new ReminderHistory(author);
        db.clear();
    }
}

module.exports = RadaScheduler;