const Util = require("../../../lib/structures/Util");
const { Command } = require('discord-akairo');

module.exports = class ToDoCommand extends Command {
    constructor() {
        super('todo', {
            aliases: ['todo', 'todolist', 'tdl'],
            category: 'Utility',
            description: {
                content: 'Manage items in your to do list.',
                examples: (message) => [
                    `\`${message.guild.prefix}todo\` - View all todo list entries`,
                    `\`${message.guild.prefix}todo view <todoID>\` - View a specific todo list entry`,
                    `\`${message.guild.prefix}todo add <text>\` - Add a todo list entry`,
                    `\`${message.guild.prefix}todo remove <todoID>\` - Remove a todo list entry`
                ],
                permissions: []
            },
            args: [{
                id: 'option',
                type: 'string',
                default: null
            }, {
                id: 'textOrId',
                type: 'string',
                match: 'rest',
                default: null
            }],
            clientPermissions: ['EMBED_LINKS']
        })
        this.thumbnail = 'https://i.br4d.vip/cXwSd_KM.png';
    }

    async exec(message, { option, textOrId }) {
        let todolist = message.member.settings.get(message.member.id, 'todolist', []);
        if (!option) {
            // Views todolist
            if (todolist.length < 1) {
                return message.responder.info('You have no items in your todolist.');
            }
            return message.channel.send(this.generateTDL(message));
        }
        if (option.toLowerCase() === "add") {
            if (!textOrId) {
                return message.responder.error('You must provide some text to add to the todolist.');
            }
            const item = {
                id: Util.generateID(),
                created: new Date(),
                text: textOrId,
            }
            message.member.addTDL(item);
            message.channel.send(this.generateTDL(message));
            return message.channel.send(`Added a task:\n    • ${item.text}\nThe unique ID is \`${item.id}\``);
        } else if (["remove", "delete"].some(op => option.toLowerCase() === op)) {
            if (!textOrId) {
                // This will be the todolist id to remove
                return message.responder.error('You must provide the unique ID for the todolist entry you want to remove.');
            }
            let todolist = message.member.settings.get(message.member.id, 'todolist', []);
            if (todolist.filter(entry => entry.id === textOrId).length < 1) {
                return message.responder.error(`The unique todo list ID \`${textOrId}\` was not found`);
            }
            let filtered =  todolist.filter(warning => warning.id !== textOrId);
            let deleted =  todolist.filter(warning => warning.id === textOrId);
            let deletedText = deleted[0].text;
            await message.member.settings.set(message.member.id, 'todolist', filtered);
            await message.channel.send(this.generateTDL(message));
            return message.channel.send(`Removed a task:\n    • ${deletedText}`);
        } else if (option.toLowerCase() === "view") {
            if (!textOrId) {
                // This will be the todolist id to remove
                return message.responder.error('You must provide the unique ID for the todolist entry you want to view.');
            }
            let todolist = message.member.settings.get(message.member.id, 'todolist', []);
            if (todolist.filter(entry => entry.id === textOrId).length < 1) {
                return message.responder.error(`The unique todo list ID \`${textOrId}\` was not found`);
            }
            let task =  todolist.filter(warning => warning.id === textOrId)[0];
            let embed = this.client.util.embed()
                .setTitle(message.author.username)
                .setColor(this.client.color)
                .setThumbnail(this.thumbnail)
                .setFooter(`Created`)
                .setTimestamp(task.created)
                .addField('ID', task.id, true)
                .addField('Content', task.text)
            return message.channel.send(embed);
        } else {
            if (todolist.length < 1) {
                return message.responder.info('You have no items in your todolist.');
            }
            return message.channel.send(this.generateTDL(message));
        }
    }
    generateTDL(message) {
        let db = message.member.settings.get(message.member.id, 'todolist', []);
        let embed = this.client.util.embed()
            .setTitle(`**${message.author.username}** - To do list`)
            .setColor(this.client.color)
            .setThumbnail(this.thumbnail)
            .setFooter(`Requested by ${message.author.username}`)
            .setTimestamp()
        if (db.length < 1) {
            embed.setDescription('Your todo list is now empty!');
            return embed;
        }
        for (let i = 0; i < db.length; i++) {
            let items = db.map((e, i) => `**${i+1}.** ${e.text} | \`${e.id}\``);
            embed.setDescription(items.join('\n') + `\n\n*Get more info with \`${message.guild.prefix}todo view <ID>\`*`);
        }
        return embed;
    }
}