class ReminderHistory {

    constructor(author) {
        this.author = author;
        this.reminders = this.author.settings.get(this.author.id, 'reminders', []);
    }

    store(obj) {
        let array = [];
        if (this.reminders.length <= 4) {
            array.push(obj);
            for (let i = 0; i < this.reminders.length; i++) {
                array.push(this.reminders[i])
            }
        } else {
            if (this.reminders.length === 5) {
                this.reminders.pop()
                array.push(obj)
                for (let i = 0; i < this.reminders.length; i++) {
                    array.push(this.reminders[i])
                }
            }
        }
        this.author.settings.set(this.author.id, 'reminders', array);
    }
    clear() {
        this.author.settings.set(this.author.id, 'reminders', []);
    }
    populate() {
        this.author.reminders.old = this.author.settings.get(this.author.id, 'reminders', []);
    }
}

module.exports = ReminderHistory;