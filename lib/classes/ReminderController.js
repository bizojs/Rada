const cron = require('cron');

/**
 * Super class that contains all functions and additional classes for Reminders
 */
class ReminderController {
    /**
     * Create your reminder for a user in Discord.
     * @param start - Date
     * @param author - D.JS Author
     * @param embed - D.JS Embed
     * @param reminder - Message, String
     * @param channel - D.JS Channel
     * @param duration - Duration, typed in human readable, String
     * @example createReminder(data, data, data, data, data, data) -> Returns a embedded promise to respond to that user when the reminder has finished.
     */
     createReminder(start, author, embed, reminder, channel, duration) {
        author.reminders.current.push(new Reminder(start, reminder, author.id))
        new cron.CronJob(start, () => {
            console.log(author)
            let old = new OldReminderController(author);
            this.deleteReminder(author, start, reminder)
            old.addReminderToDB(new Reminder(start, reminder, author.id))
            author.send(embed.setDescription(`You asked me \`${duration}\` ago to remind you of the following:\n\n${reminder}`)).catch(() => {
                return channel.send(author, embed.setDescription(`I tried to DM you your reminder, but I was unable to.\n\nYou asked me \`${duration}\` ago to remind you of the following: **${reminder}**`))
            });
        });
    }

    /**
     * Gets the author's reminders and deletes the one specified, Does not stop CRON Job!
     * @param author - D.JS Author
     * @param start - Date
     * @param reminder - Message, String
     */
    deleteReminder(author, start, reminder) {
         let current = author.reminders.current;
         current.splice(current.indexOf(new Reminder(start, reminder, author.id)), 1)
    }

    /**
     * Removes all current reminders for this user. Note this does not stop a CRON Job!
     * @param author - D.JS Author
     */
    clearAllReminders(author) {
        let current = author.reminders.current;
        current.length = 0;
    }
    /**
     * Removes the saved reminders in MongoDB and from the old array.
     * @param author
     */
    clearAllSaved(author) {
        let old = author.reminders.old;
        old.length = 0;
    }
}

/**
 * A reminder class that contains internal data to view reminders.
 */
class Reminder {
    constructor(duration, message, user) {
        this.duration = duration;
        this.message = message;
        this.user = user;
    }
}
class OldReminderController {
    constructor(author) {
        this.author = author;
    }
    addReminderToDB(obj) {
        let array = [];
        let db = this.author.settings.get(this.author.id, 'reminders', array);
        if (db.length >= 4) {
            array.push(obj);
        } else {
           if (db.length === 5) {
               db.pop()
               db.push(obj)
           }
        }
        this.author.settings.set(this.author.id, 'reminders', array);
    }
}
module.exports.Reminder = Reminder
module.exports = ReminderController;