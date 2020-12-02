const { Command } = require('discord-akairo');
const figlet = require('figlet');

module.exports = class extends Command {
    constructor() {
        super('ascii', {
            aliases: ['ascii'],
            category: 'Text',
            description: {
                content: 'Send your text as ascii',
                permissions: ['EMBED_LINKS']
            },
            args: [{
                id: 'ascii',
                type: 'string',
                default: null
            },
            {
                id: 'text',
                type: 'string',
                match: 'rest',
                default: null
            }]
        })
    }
    async exec(message, { ascii, text }) {
        if (!ascii) return message.responder.info(`**Please provide the font name of the ascii art**\nYou can use the \`ascii list\` command to view all font types then use \`ascii <font> <text>\` to use one.\n*If a font name has more than one word, surround it in quotation marks e.g. \`"Dr Pepper"\`*`);
        if (!text && ascii !== 'list') return message.responder.error('**Please provide some text for the ascii art**');
        if (ascii.toLowerCase() === 'list') {
            return this.list(message);
        }
        const fonts = figlet.fontsSync();
        let validFont = fonts.filter(f => ascii.toLowerCase() === f.toLowerCase());
        if (validFont.length < 1) return message.responder.error('**The font you provided wasn\'t found**');
        if (text.length > 32) return message.responder.error('**Provide less then 32 characters**');
        if (!isNaN(text)) return message.responder.error('**You cannot asciify numbers**');
        return message.channel.send(
            figlet.textSync(text, { font: validFont }), {
            code: 'asciidoc'
        });
    }
    async list(message) {
        const fonts = figlet.fontsSync();
        const pages = this.client.chunkify(fonts, 25);
        return message.paginate(pages, 'Ascii types')
    }
}