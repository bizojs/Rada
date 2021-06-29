const { Command } = require('discord-akairo');

module.exports = class ConvertTempCommand extends Command {
    constructor() {
        super('converttemp', {
            aliases: ['converttemp', 'ct'],
            category: 'Miscellaneous',
            description: {
                content: 'Convert a temperature.',
                permissions: ['EMBED_LINKS']
            },
            args: [{
                id: 'temp',
                type: 'number'
            }],
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec(message, { temp }) {
        if (!temp) {
            return message.responder.error('Please enter a valid number')
        }
        let converted = this.client.convertTemp(temp)
        let embed = this.client.util.embed()
            .setTitle('Temperature conversion')
            .setColor(this.client.color)
            .addField(`${temp}°C to Fahrenheit`, `${converted.CtoF}°F`)
            .addField(`${temp}°F to Celsius`, `${converted.FtoC}°C`)
            .setTimestamp()
        return message.util.send(embed);
    }
}
