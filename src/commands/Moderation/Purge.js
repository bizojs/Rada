const { Command } = require('discord-akairo');

module.exports = class PurgeCommand extends Command {
    constructor() {
        super('purge', {
            aliases: ['purge', 'prune', 'clear'],
            category: 'Moderation',
            description: {
                content: 'Bulk deletes up to 100 messages from the channel',
                extended: 'If you want to delete only bot messages you can use the flag \`--bot\`',
                permissions: ['MANAGE_MESSAGES']
            },
            args: [{
                    id: 'amount',
                    type: 'integer',
                    default: null
                },
                {
                    id: 'botFlag',
                    match: 'flag',
                    flag: '--bot'
                }
            ],
            userPermissions: ['MANAGE_MESSAGES'],
            clientPermissions: ['MANAGE_MESSAGES']
        });
    }

    async exec(message, { amount, botFlag }) {
        if (!amount) {
            return message.responder.error('**Please input a valid amount that is less than 100**');
        }
        if (amount > 99) {
            return message.responder.error('**Please input a valid amount that is less than 100**');
        }
        await this.bulkDeleteHandler(message, parseInt(amount.toString().replace(/-/g, '')), botFlag);
    }
    async bulkDeleteHandler(message, limit, bot) {
        await message.delete();
        if (!bot) {
            try {
                message.channel.bulkDelete(limit, true);
                return message.channel.send(`${message.emotes.success} | **You have cleared** \`${limit}\` **message${limit === 1 ? '' : 's'}**`).then((msg) => {
                    setTimeout(() => {
                        msg.delete()
                    }, 3000);
                });
            } catch (e) {
                return message.channel.send(e.message);
            }
        } else {
            message.channel.messages.fetch({ limit: limit + 1 }).then(async(m) => {
                if (m.filter(m => m.author.bot).size < 1) {
                    return message.channel.send(`${message.emotes.error} | **No messages to delete were found**`);
                }
                message.channel.bulkDelete(m.filter(m => m.author.bot).map(m => m.id), true);
                return message.channel.send(`${message.emotes.success} | **You have cleared** \`${m.size - 1}\` **message${limit === 1 ? '' : 's'} from bots**`).then((msg) => {
                    setTimeout(() => {
                        msg.delete()
                    }, 3000);
                });
            })
        }
    }
}