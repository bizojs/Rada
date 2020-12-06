const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const math = require('mathjs');
const req = require('@aero/centra');

class MathCommand extends Command {
    constructor() {
        super('math', {
           aliases: ['math', 'calculate'],
           category: 'Miscellaneous',
           description: {
             content: 'Who needs a calculator when you can just use Rada ',
             permissions: []
           }
        });
    }

    async exec(message, args) {
      let sum = message.util.parsed.content.replace(/x/g, '*').replace(/÷/g, '/').replace(/×/g, '*');
      if (!sum) {
        return message.responder.error('**Please enter a math sum**')
      }
      let resp;
      try {
          resp = math.evaluate(sum);
      } catch (error) {
          // message.util.send(error.message)
          return message.util.send('The math sum you entered is not valid.');
      }
      return message.util.send(`\`\`\`${sum} = ${resp}\`\`\``);
    }
}

module.exports = MathCommand;