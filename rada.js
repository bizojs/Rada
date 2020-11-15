const { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, MongooseProvider } = require('discord-akairo');
const model = require('./src/providers/mongoose');
const { Timestamp } = require('@skyra/timestamp');
const CustomLog = require('./lib/log');
const config = require('./src/config');
const terminal = new CustomLog;
require('dotenv').config();

class RadaClient extends AkairoClient {
    constructor() {
        super({
        	ownerID: config.owners
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
                    return this.settings.get(message.guild.id, 'prefix', config.production ? config.prefix : config.devPrefix);
                }

                return config.production ? config.prefix : config.devPrefix;
            },
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
    daysBetween(startDate, endDate) {
        if (!endDate) endDate = Date.now();
        const treatAsUTC = (date) => {
            var result = new Date(date);
            result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
            return result;
        };
        let millisecondsPerDay = 24 * 60 * 60 * 1000;
        return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
    }
    chunkify(input, chunkSize) {
        const output = [];
        for (let i = 0; i < input.length; i += chunkSize){
            output.push(input.slice(i, i + chunkSize));
        }
        return output;
    }
    timeFormat(ts, date, encased = false) {
        const timestamp = new Timestamp(ts);
        const days = this.daysBetween(date).toFixed(0);
        if (encased) {
            return `${timestamp.display(date)} [${days} day${days !== 1 ? 's' : ''} ago]`;
        }
        return `${timestamp.display(date)}\n${days} day${days !== 1 ? 's' : ''} ago`;
    }
}
const client = new RadaClient();
client.login(process.env.TOKEN);