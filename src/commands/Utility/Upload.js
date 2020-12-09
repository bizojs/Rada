const { Command } = require('discord-akairo');
const centra = require('@aero/centra');


class UploadCommand extends Command {
    constructor() {
        super('upload', {
           aliases: ['upload'],
           category: 'Utility',
           description: {
             content: 'Upload an image to Imgur.',
             permissions: []
           },
           cooldown: 60000,
           ratelimit: 1
        });
    }

    async exec(message) {
      if (message.attachments.first() === undefined) {
        return message.util.send('**Image attachment/file is missing**');
      }
      try {
        const res = await centra('https://api.imgur.com/3', 'POST')
          .path('/image')
          .header('Authorization', `Client-ID ${process.env.API_IMGUR_CLIENT_ID}`)
          .body({ image: message.attachments.first().url })
          .send()
          .then(res => res.json);
        await message.author.send(`Here is the link to delete the image if needed: <https://imgur.com/delete/${res.data.deletehash}>`)
          .then(() => {})
          .catch(err => {
            this.client.users.cache.get(this.client.ownerID[0]).send({ embed: this.client.util.embed()
              .setColor(this.client.color)
              .addField('Upload command', `**${message.author.tag}** has just uploaded an image, but i was unable to dm them.\nTheir delete URL is: ${imgur_delete + res.data.deletehash}\nThe image they uploaded:`)
              .setImage(res.data.link)
            })
          });
        return message.util.send('Here is the uploaded image link: ' + res.data.link);
      } catch {
        return message.util.send('**Image attachment/file is missing**');
      }
    }
}

module.exports = UploadCommand;