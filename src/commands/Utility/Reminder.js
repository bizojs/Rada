const { Command } = require('discord-akairo');
const ms = require('ms');

module.exports = class ReminderCommand extends Command {
    constructor() {
        super('reminder', {
            aliases: ['reminder', 'remindme'],
            category: 'Utility',
            description: {
                content: 'Create a reminder',
                permissions: []
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
                }
            ],
            clientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS']
        });
    }

    async exec(message, { duration, reminder }) {
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
        let date = new Date(Date.now() + ms(duration));
        await this.client.RadaReminder.create(date, message, reminder, embed, current);
        return message.responder.success(`I will remind you in \`${current}\``);
    }
}