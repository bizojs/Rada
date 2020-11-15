const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const req = require('@aero/centra');

class HasteCommand extends Command {
    constructor() {
        super('hastebin', {
          aliases: ['hastebin', 'haste'],
          category: 'Miscellaneous',
          description: 'Uploads text/code to a shareable hastebin link',
          cooldown: 60000,
          ratelimit: 1
        });
    }

    async exec(message) {
      if (!message.util.parsed.content) {
        return message.channel.send('giv content')
      }
      try {
        const res = await req("https://haste.br4d.vip/documents", 'POST').body(message.util.parsed.content + `\n\n\n\n- Uploaded with ${this.client.user.username}™️`).json();        
        return message.channel.send(`Here is the uploaded document: https://haste.br4d.vip/${res.key}`);
      } catch (e) {
        return message.channel.send(`**Failed to upload**: \`${e.message}\``);
      }
    }
}

module.exports = HasteCommand;