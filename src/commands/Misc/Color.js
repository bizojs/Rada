const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const req = require('@aero/centra');

class ColorCommand extends Command {
    constructor() {
        super('color', {
           aliases: ['color'],
           category: 'Miscellaneous',
           description: 'Information about a color if you provide a hex value.\nRunning the command without a hex value will generate a random hex and get information for it.',
           args: [{
              id: 'hex',
              type: /^#?([A-F0-9]{6}|[A-F0-9]{3})$/i,
              default: null
           }]
        });
    }

    async exec(message, args) {
        let hex = !args.hex ? this.generateHex() : args.hex["match"][0]
        let color = hex.replace(/#/g, '');
        const data = await req(`https://api.alexflipnote.dev/color/${color}`).json()
        return message.channel.send({ embed: new MessageEmbed()
            .setColor(data.hex)
            .setTitle(`Color Information for ${data.hex}`)
            .setDescription(`Color Name: \`${data.name}\`\nBrightness: \`${data.brightness}\`\nInt: \`${data.int}\`\nRGB: \`${data.rgb}\``)
            .addField('Shade', data.shade.join(', '))
            .addField('Tint', data.tint.join(', '))
            .setThumbnail(data.image)
            .setImage(data.image_gradient)
        });
    }
    generateHex() {
        return Math.floor(Math.random()*16777215).toString(16);
    }
}

module.exports = ColorCommand;