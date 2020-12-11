const { Command } = require('discord-akairo');
const req = require('@aero/centra');

class TriviaCommand extends Command {
  constructor() {
    super('trivia', {
      aliases: ['trivia', 'quiz'],
      category: 'Miscellaneous',
      description: {
        content: 'Get asked a random trivia question.',
        permissions: ['EMBED_LINKS']
      },
      cooldown: 30000,
      ratelimit: 1,
      clientPermissions: ['EMBED_LINKS']
    });
    this.options = {
      max: 1,
      time: 30000,
      errors: ["time"],
    };
  }

  async exec(message) {
    let data = await req('https://opentdb.com/api.php?amount=1').json();
    let trivia = data.results[0];
    let question = trivia.question.replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&eacute;/, 'é');
    let answer = trivia.correct_answer.replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&eacute;/, 'é');

    let embed = this.client.util.embed()
      .setColor('BLUE')
      .setTitle('Trivia')
      .setThumbnail(this.client.avatar)
      .addField('Category', trivia.category, true)
      .addField('Difficulty', trivia.difficulty, true)
      .addField('Time', '**30 seconds**', true)
      .addField('Question', `${trivia.type === 'boolean' ? '**True / False** - ' : ''} ${question}`)
      .setTimestamp()
    await message.util.send(embed);

    try {
      const collected = await message.channel.awaitMessages(a => answer.toLowerCase() === a.content.toLowerCase(), this.options);
      const winnerMessage = collected.first();
      let winEmbed = this.client.util.embed()
        .setColor('GREEN')
        .setTitle('Trivia')
        .setThumbnail(this.client.avatar)
        .addField('Winner', winnerMessage.author.tag, true)
        .addField('Answer', answer, true)
        .addField('Question', question)
        .setTimestamp()
      return message.reply(winEmbed);

    } catch (_) {
        let endEmbed = this.client.util.embed()
          .setColor('RED')
          .setTitle('Trivia')
          .setThumbnail(this.client.avatar)
          .setDescription('No one guessed the correct answer in time!')
          .addField('Question', question)
          .addField('Answer', answer)
          .setTimestamp()
        return message.reply(endEmbed);
    }
  }
}

module.exports = TriviaCommand;