const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class EvalCommand extends Command {
    constructor() {
        super('eval', {
            aliases: ['eval', 'ev'],
            ownerOnly: true,
            category: 'Owner',
            description: 'Evaluate javascript code.'
        });
    }

    async exec(message) {
        let argresult = message.util.parsed.content;
        argresult = argresult.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
        if (!argresult) {
            return message.channel.send('Try again with some code to evaluate.')
        }
        try {
            var evaled = eval(argresult);
            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);
            if (evaled.includes(this.client.token)) {
                return message.channel.send('I will not show my token.');
            }
            if(this.clean(evaled) === "Promise { <pending> }") {
              return;
            }
            if(this.clean(evaled).length > 1999) {
                console.log(this.clean(evaled));
                return message.channel.send("Message exceeded 1999 characters, I've logged it instead. ")
            }
            return message.channel.send(`\`\`\`js\n${this.clean(evaled)}\`\`\``)
        } catch (err) {
            return message.channel.send(`\`\`\`js\n${this.clean(err)}\`\`\``);
        }
    }
    clean(text) {
        if (typeof (text) === "string")
            return text.replace(/'/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }
}

module.exports = EvalCommand;
