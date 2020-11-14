const { Listener } = require('discord-akairo');

class ErrorListener extends Listener {
    constructor() {
        super('error', {
            emitter: 'commandHandler',
            event: 'error'
        });
    }

    async exec(error, message) {
        console.log(error)
        return message.channel.send(`\`\`\`js\n${error.message}\`\`\``);
    }
};

module.exports = ErrorListener;