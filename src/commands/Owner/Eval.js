const { Command } = require('discord-akairo');
const { MessageEmbed, MessageAttachment, Permissions: { FLAGS } } = require('discord.js');
const Stopwatch = require('../../../lib/structures/Stopwatch');
const Util = require('../../../lib/structures/Util');
const Type = require('../../../lib/structures/Type');
const { inspect } = require('util');
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
            },
            args: [{
                id: 'argresult',
                type: 'string',
                match: 'rest'
            },
            {
                id: 'async',
                match: 'flag',
                flag: '--async',
                unordered: true
            },
            {
                id: 'silent',
                match: 'flag',
                flag: '--silent',
                unordered: true
            }]
        });
    }

    async exec(message, { argresult, async, silent }) {
        if (!argresult) {
            return message.responder.error('**Enter some code that you want to be evaluated**');
        }
        const { success, result, time, type } = await this.eval(message, argresult, async);
        const footer = Util.codeBlock('ts', type);
        const output = success ? `**Output**:${Util.codeBlock('js', result)}\n**Type**:${footer}\n${time}` : `**Error**:${Util.codeBlock('js', result)}\n**Type**:${footer}\n${time}`
        if (silent) return null;

        if (output.length > 2000) {
            if (message.guild && message.guild.me.permissions.has('ATTACH_FILES')) {
                return message.channel.send(`Output was too long... sent the result as a file.\n**Type**:${footer}\n${time}`,
                    new MessageAttachment(Buffer.from(result), 'output.txt'));
            }
            console.log(result);
            return message.channel.send(`Output was too long... sent the result to console.\n**Type**:${footer}\n${time}`);
        }
        return message.channel.send(output);
    }

    async eval(message, code, async) {
        const msg = message;
        code = code.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
        const stopwatch = new Stopwatch();
        let success, syncTime, asyncTime, result;
        let thenable = false;
        let type;
        try {
            if (async) code = `(async () => {\n${code}\n})();`;
            result = eval(code);
            syncTime = stopwatch.toString();
            type = new Type(result);
            if (Util.isThenable(result)) {
                thenable = true;
                stopwatch.restart();
                result = await result;
                asyncTime = stopwatch.toString();
            }
            success = true;
        } catch (error) {
            if (!syncTime) syncTime = stopwatch.toString();
            if (!type) type = new Type(error);
            if (thenable && !asyncTime) asyncTime = stopwatch.toString();
            result = error;
            success = false;
        }

        stopwatch.stop();
        if (typeof result !== 'string') {
            result = inspect(result, {
                depth: 0,
                showHidden: false
            });
        }
        return { success, type, time: this.formatTime(syncTime, asyncTime), result: Util.clean(result) };
    }

    formatTime(syncTime, asyncTime) {
        return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
    }
    
}

module.exports = EvalCommand;
