const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const req = require('@aero/centra');

class EvalCommand extends Command {
    constructor() {
        super('eval', {
            aliases: ['eval', 'ev'],
            ownerOnly: true,
            category: 'Owner',
            description: {
                content: 'Evaluate javascript code.\nAutomatic async support if the code includes \`await\`',
                permissions: []
            }
        });
    }

    async exec(message) {
        let argresult = message.util.parsed.content;
        argresult = argresult.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
        if (!argresult) {
            return message.channel.send('Try again with some code to evaluate.')
        }
        try {
            if (argresult.includes('await')) argresult = `(async () => {\n${argresult}})();`
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
                try {
                    const res = await req("https://haste.br4d.vip/documents", 'POST').body(this.clean(evaled)).json();        
                    return message.responder.info(`**Message exceeded 2000 characters, uploaded to hastebin**: https://haste.br4d.vip/${res.key}`);
                } catch (e) {
                    console.log(this.clean(evaled));
                    return message.channel.send('Message exceeded 2000 characters and I was unable to upload it. Logged to the console.');
                }
            }
            return message.channel.send(`**Output**:\n\`\`\`js\n${this.clean(evaled)}\`\`\`\n**Type**:\n\`\`\`ts\n${typeof this.clean(evaled)}\`\`\``)
        } catch (err) {
            return message.channel.send(`**Output**:\n\`\`\`js\n${this.clean(err.message)}\`\`\`\n**Type**:\n\`\`\`ts\n${err.toString().split(':')[0]}\`\`\``);
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
