const { Command } = require('discord-akairo');
const ms = require('ms');

module.exports = class ReminderCommand extends Command {
    constructor() {
        super('reminder', {
            aliases: ['reminder', 'remindme'],
            category: 'Utility',
            description: {
                content: 'Create a reminder'
            },
            args: [{
                id: 'duration',
                type: 'string',
                default: null
            },
            {
                id: 'reminder',
                type: 'string',
                match: 'rest',
                default: null
            }],
            clientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS', 'MANAGE_MESSAGES']
        });
    }

    async exec(message, { duration, reminder }) {
        return message.responder.error('Due to an issue with cron tasks on linux, this command has to be disabled due to causing a memory leak.');
        let reminderController = this.client.reminderController;
        if (!duration || !ms(duration)) {
            return message.responder.error('**Please provide a valid time** (Example: \`5h\`, \`1d\`, \`30m\`)')
        }
        if (!reminder) {
            return message.responder.error('**Please provide a message for the reminder**');
        }
        if (reminder.length > 800) {
            return message.responder.error('**Please make the reminder less than 800 characters**');
        }
        let current = ms(ms(duration), { long: true });
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setThumbnail(this.client.avatar)
            .setTitle('Reminder')
        let startDate = new Date(Date.now() + ms(duration));
        reminderController.createReminder(startDate, message.author, embed, reminder, message, current);
        return message.responder.success(`I will remind you in \`${current}\``);
    }
}
