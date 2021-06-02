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
            }],
            clientPermissions: ['EMBED_LINKS', 'ADD_REACTIONS', 'MANAGE_MESSAGES']
        });
    }

    async exec(message, { duration, reminder }) {
        if (!duration || !ms(duration)) {
            return message.responder.error('**Please provide a valid time** (Example: \`5h\`, \`1d\`, \`30m\`)')
        }
        if (ms(duration) > 604800000) {
            return message.responder.error('You can\'t create a reminder longer than 1 week.');
        }
        if (ms(duration) < 10000) {
            return message.responder.error('You can\'t create a reminder shorter than 10 seconds.');
        }
        if (!reminder) {
            return message.responder.error('**Please provide a message for the reminder**');
        }
        let current = ms(ms(duration), { long: true });
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setThumbnail(this.client.avatar)
            .setTitle('Reminder')
        let startDate = new Date(Date.now() + ms(duration));
        this.client.createReminder(startDate, message.author, embed, reminder, message.channel, current);
        return message.responder.success(`I will remind you in \`${current}\`. Make sure I am able to DM you.`);
    }
}
