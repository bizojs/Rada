const { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } = require('discord-akairo');
const config = require('./src/config');
require('dotenv').config();

class RadaClient extends AkairoClient {
    constructor() {
        super({ownerID: ['286509757546758156']}, {disableMentions: 'everyone'});
        this.commandHandler = new CommandHandler(this, {
        	directory: './src/commands/',
        	prefix: config.production ? config.prefix : config.devPrefix,
        	blockBots: true,
        	allowMention: true,
        	handleEdits: true,
    		commandUtil: true
    	});
        this.inhibitorHandler = new InhibitorHandler(this, {directory: './src/inhibitors/'});
        this.listenerHandler = new ListenerHandler(this, {directory: './src/listeners/'});
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler)
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.setEmitters({
		    commandHandler: this.commandHandler,
		    inhibitorHandler: this.inhibitorHandler,
		    listenerHandler: this.listenerHandler
		});
		this.listenerHandler.loadAll();
		this.inhibitorHandler.loadAll();
		this.commandHandler.loadAll();
		this.color = '#f05151';
    }
    async login(token) {
    	return super.login(token);
    }
}
const client = new RadaClient();
client.login(process.env.TOKEN);