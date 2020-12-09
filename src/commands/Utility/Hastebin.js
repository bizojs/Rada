const { Command } = require('discord-akairo');
const req = require('@aero/centra');

class HasteCommand extends Command {
    constructor() {
        super('hastebin', {
          aliases: ['hastebin', 'haste'],
          category: 'Utility',
          description: {
            content: 'Uploads text/code to a shareable hastebin link',
            permissions: []
          },
          args: [{
            id: 'text',
            type: 'string',
            match: 'rest'
          }],
          cooldown: 60000,
          ratelimit: 1
        });
    }

    async exec(message, args) {
      if (!args.text) {
        return message.responder.error('**Please provide some text to upload to hastebin**');
      }
      try {
        const res = await req("https://haste.br4d.vip/documents", 'POST').body(args.text + `\n\n\n\n- Uploaded with ${this.client.user.username}™️`).json();        
        return message.util.send(`Here is the uploaded document: https://haste.br4d.vip/${res.key}`);
      } catch (e) {
        return message.util.send(`**Failed to upload**: \`${e.message}\``);
      }
    }
}

module.exports = HasteCommand;