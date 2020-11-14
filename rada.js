const { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, MongooseProvider } = require('discord-akairo');
const model = require('./src/providers/mongoose');
const CustomLog = require('./lib/log');
const config = require('./src/config');
const terminal = new CustomLog;
require('dotenv').config();

class RadaClient extends AkairoClient {
    constructor() {
        super({
        	ownerID: ['286509757546758156']
        }, {
        	disableMentions: 'everyone',
        	fetchAllMembers: true,
        	partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
        	  ws: {
			    intents: [
			      "GUILDS",
			      "GUILD_MESSAGES",
			      "GUILD_MEMBERS"
			    ]
			  }
        });
        this.commandHandler = new CommandHandler(this, {
        	directory: './src/commands/',
        	prefix: (message) => {
                if (message.guild) {
                    // The third param is the default.
                    return this.settings.get(message.guild.id, 'prefix', config.production ? config.prefix : config.devPrefix);
                }

                return config.production ? config.prefix : config.devPrefix;
            },
        	// config.production ? config.prefix : config.devPrefix,
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
		this.settings = new MongooseProvider(model);
    }
    async login(token) {
    	await this.settings.init();
    	terminal.success('Connected to Dabatase');
    	return super.login(token);
    }
}
const client = new RadaClient();
client.login(process.env.TOKEN);