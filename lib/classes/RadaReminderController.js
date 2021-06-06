const cron = require('cron');

/**
 * Super class that contains all functions and additional classes for Reminders
 */
class RadaReminderController {
    constructor(client) {
        this.client = client;
    }
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
     createReminder(start, author, embed, reminder, message, duration) {
        let reminderObject = new RadaReminder(start, reminder, author.id)
        author.reminders.current.push(reminderObject)
        new cron.CronJob(start, () => {
            let old = new RadaOldReminderController(author);
            this.deleteReminder(author, start, reminder);
            old.addReminderToDB(new RadaReminder(start, reminder, author.id))
            author.send(embed.setDescription(`You asked me \`${duration}\` ago to remind you of the following:\n\n${this.client.Util.trimString(reminder, 1800)}`)).catch(() => {
                return message.reply(embed.setDescription(`I tried to DM you your reminder, but I was unable to.\n\nYou asked me \`${duration}\` ago to remind you of the following: **${this.client.Util.trimString(reminder, 1800)}**`))
            });
        }).start();
    }

    /**
     * Gets the author's reminders and deletes the one specified, Does not stop CRON Job!
     * @param author - D.JS Author
     * @param start - Date
     * @param reminder - Message, String
     */
    deleteReminder(author, start, reminder) {
        let current = author.reminders.current;
        let old = author.reminders.old;
        let data = new RadaReminder(start, reminder, author.id);
        current.splice(current.indexOf(data), 1);
        
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
        let db = new RadaOldReminderController(author);
        old.length = 0;
        db.deleteAllRemindersFromDB();
    }
}

/**
 * A reminder class that contains internal data to view reminders.
 */
class RadaReminder {
    constructor(duration, message, user) {
        this.duration = duration;
        this.message = message;
        this.user = user;
    }
}
/** 
 * Our old reminder controller that saves the old reminders (up to 5!) to the database.
*/
class RadaOldReminderController {
    constructor(author) {
        this.author = author;
    }
    addReminderToDB(obj) {
        let array = []; // Construct our array
        let db = this.author.settings.get(this.author.id, 'reminders', array); // Get the existing data from the database and make it the array
        if (db.length <= 4) { // If length is less than 4 push the data
            array.push(obj); // Push the reminder object
            for (let i = 0; i < db.length; i++) { // For each object in the databse add it to the array
                array.push(db[i])
            }
        } else { // If the reminder length is greater than 5 then lets make sure we pop off the stack
           if (db.length === 5) { 
               db.pop() // Removes the last element from the array
               array.push(obj) // Pushes the reminder
               for (let i = 0; i < db.length; i++) { // Same for loop as before
                   array.push(db[i])
               }
           }
        }
        this.author.settings.set(this.author.id, 'reminders', array);
    }
    deleteAllRemindersFromDB() {
        this.author.settings.set(this.author.id, 'reminders', []);
    }
    populateData() {
        this.author.reminders.old = this.author.settings.get(this.author.id, 'reminders', []);
    }
}

module.exports = {
    RadaReminderController: RadaReminderController,
    RadaOldReminderController: RadaOldReminderController,
    RadaReminder: RadaReminder
}