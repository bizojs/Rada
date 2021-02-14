const { Command } = require('discord-akairo');
const { reactions, emotes } = require('../../../lib/constants');

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

        if (!option) { // This will show all todolist entries
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
                id: this.client.Util.generateID(),
                created: new Date(),
                text: textOrId,
            }
            message.member.addTDL(item);
            let original = `Added a task:\n    • ${item.text}\nThe unique ID is \`${item.id}\``
            let m = await message.channel.send(`Added a task:\n    • ${item.text}\nThe unique ID is \`${item.id}\`\n*React with ${emotes.success} to view your todo list.*`)
            await m.reactor.success();
            const reactionCollector = m.createReactionCollector((reaction, user) =>
                reaction.emoji.id === reactions.id.success && user.id === message.author.id, { time: 60000 });

            reactionCollector.on('collect', async (reaction) => {
                reactionCollector.stop();
                message.channel.send(this.generateTDL(message));
                m.edit(original);
                if (!m.deleted && message.guild.me.permissions.has('MANAGE_MESSAGES')) {
                    await m.reactions.removeAll();
                }
                await reaction.users.remove(message.author);
            });

            reactionCollector.on('end', async () => {
                if (!m.deleted && message.guild.me.permissions.has('MANAGE_MESSAGES')) {
                    await m.reactions.removeAll();
                }
            });


        } else if (["remove", "delete"].some(op => option.toLowerCase() === op)) { // This will be the todolist id to remove

            if (!textOrId) {
                return message.responder.error('You must provide the unique ID for the todolist entry you want to remove.');
            }
            let todolist = message.member.settings.get(message.member.id, 'todolist', []);
            if (todolist.filter(entry => entry.id === textOrId.toUpperCase()).length < 1) {
                return message.responder.error(`The unique todo list ID \`${textOrId}\` was not found`);
            }
            let filtered =  todolist.filter(warning => warning.id !== textOrId.toUpperCase());
            let deleted =  todolist.filter(warning => warning.id === textOrId.toUpperCase());
            let deletedText = deleted[0].text;
            await message.member.settings.set(message.member.id, 'todolist', filtered);
            let original = `Removed a task:\n    • ${deletedText}`
            let m = await message.channel.send(`Removed a task:\n    • ${deletedText}\n*React with ${emotes.success} to view your todo list.*`);
            await m.reactor.success();
            const reactionCollector = m.createReactionCollector((reaction, user) =>
                reaction.emoji.id === reactions.id.success && user.id === message.author.id, { time: 60000 });

            reactionCollector.on('collect', async (reaction) => {
                reactionCollector.stop();
                message.channel.send(this.generateTDL(message));
                m.edit(original);
                if (!m.deleted && message.guild.me.permissions.has('MANAGE_MESSAGES')) {
                    await m.reactions.removeAll();
                }
                await reaction.users.remove(message.author);
            });

            reactionCollector.on('end', async () => {
                if (!m.deleted && message.guild.me.permissions.has('MANAGE_MESSAGES')) {
                    await m.reactions.removeAll();
                }
            });


        } else if (["show", "view"].some(op => option.toLowerCase() === op)) { // This will be the todolist id to show

            if (!textOrId) {
                return message.responder.error('You must provide the unique ID for the todolist entry you want to view.');
            }
            let todolist = message.member.settings.get(message.member.id, 'todolist', []);
            if (todolist.filter(entry => entry.id === textOrId.toUpperCase()).length < 1) {
                return message.responder.error(`The unique todo list ID \`${textOrId}\` was not found`);
            }
            let task =  todolist.filter(warning => warning.id === textOrId)[0];
            let embed = this.client.util.embed()
                .setTitle(message.author.username)
                .setColor(this.client.color)
                .setThumbnail(this.thumbnail)
                .addField('ID', task.id, true)
                .addField('Content', task.text)
            if (task.edited) {
                embed.setFooter(`Edited`).setTimestamp(task.edited)
            } else {
                embed.setFooter(`Created`).setTimestamp(task.created)
            }
            return message.channel.send(embed);


        } else if (option.toLowerCase() === "clear") {  // This will clear all todolist entries

            await message.member.clearTDL();
            return message.channel.send(this.generateTDL(message));


        } else if (option.toLowerCase() === "edit") {  // This will edit a todolist entry
            if (!textOrId) {
                return message.responder.error('You must provide the unique ID for the todolist entry you want to edit.');
            }
            let args = textOrId.split(' ');
            let id = args[0];
            let arr = [];
            for (let i = 1; i < args.length; i++) {arr.push(args[i])}
            let todolist = message.member.settings.get(message.member.id, 'todolist', []);
            if (todolist.filter(entry => entry.id === id.toUpperCase()).length < 1) {
                return message.responder.error(`The unique todo list ID \`${id}\` was not found`);
            }
            let updated = arr.join(' ');
            if (arr.length < 1) {
                return message.responder.error('You must provide the text you want the entry to be edited with.');
            }
            let filtered =  todolist.filter(warning => warning.id !== id.toUpperCase());
            let toEdit =  todolist.filter(warning => warning.id === id.toUpperCase());
            let toEditID = toEdit[0].id;
            let toEditText = toEdit[0].text;
            const item = {
                id: toEditID,
                created: new Date(),
                text: updated,
                edited: new Date()
            }
            await message.member.settings.set(message.member.id, 'todolist', filtered);
            await message.member.addTDL(item);
            let original = `Edited a task:\n    • \`Before:\` ${toEditText}\n    • \`After:\` ${updated}`
            let m = await message.channel.send(`Edited a task:\n    • \`Before:\` ${toEditText}\n    • \`After:\` ${updated}\n*React with ${emotes.success} to view your todo list.*`);
            await m.reactor.success();
            const reactionCollector = m.createReactionCollector((reaction, user) =>
                reaction.emoji.id === reactions.id.success && user.id === message.author.id, { time: 60000 });

            reactionCollector.on('collect', async (reaction) => {
                reactionCollector.stop();
                message.channel.send(this.generateTDL(message));
                m.edit(original);
                if (!m.deleted && message.guild.me.permissions.has('MANAGE_MESSAGES')) {
                    await m.reactions.removeAll();
                }
                await reaction.users.remove(message.author);
            });

            reactionCollector.on('end', async () => {
                if (!m.deleted && message.guild.me.permissions.has('MANAGE_MESSAGES')) {
                    await m.reactions.removeAll();
                }
            });


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