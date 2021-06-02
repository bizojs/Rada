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
            }, {
                id: 'tofrom',
                type: 'string',
                default: null
            }],
            clientPermissions: ['EMBED_LINKS']
        });
    }

    async exec(message, { temp, tofrom }) {
        let helpEmbed = this.client.util.embed()
            .setTitle('Temperature conversion')
            .setDescription(`To convert temperature, you must make sure you use the correct arguments. You can find the correct arguments below along with an example:\n\n\`converttemp <temp> <from>\`\n\nExample:\n\`${this.client.settings.get(message.guild.id, 'prefix', message.guild.prefix)}ct 30 C\`\n\nResponse:\n${message.emotes.checked} | **30°C** converted to \`Fahrenheit\` is **86.0°F**`)
        if (!temp || !tofrom) {
            return message.util.send(helpEmbed)
        }
        let converted = this.client.convertTemp(parseInt(temp), tofrom)
        let embed = this.client.util.embed()
            .setTitle('Temperature conversion')
            .addField('From', converted.from, true)
            .addField('To', converted.to, true)
            .addField('Converted', `${converted.converted.toFixed(1)}°${converted.to.toUpperCase()}`)
        return message.util.send(embed);
    }
}
