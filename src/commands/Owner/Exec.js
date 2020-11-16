const { Command } = require('discord-akairo');
const { execSync } = require('child_process');
const { trimString } = require('../../../lib/util');

class ExecCommand extends Command {
    constructor() {
        super('exec', {
            aliases: ['sh', 'exec'],
            ownerOnly: true,
            category: 'Owner',
            description: 'Execute shell commands.'
        });
    }

    async exec(message) {
        if (!message.util.parsed.content) {
            return message.channel.send('Provide a shell command to run');
        }
        try {
            let executed = await execSync(`${message.util.parsed.content}`).toString();
            if (executed == '') return message.react('✅')

            if (executed.length > 2000) {
                return message.channel.send(`\`\`\`prolog\n$ ${message.util.parsed.content}\n\n${trimString(executed, 1970 - message.util.parsed.content.length)}\`\`\``);
            }
            return message.channel.send(`\`\`\`prolog\n$ ${message.util.parsed.content}\n\n${executed}\`\`\``);
        } catch (e) {
            return message.channel.send(`\`\`\`prolog\n$ ${message.util.parsed.content}\n\n${e.message}\`\`\``);
        }
    }
}

module.exports = ExecCommand;
