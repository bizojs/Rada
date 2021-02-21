const { GUILDS, GUILD_MEMBERS, GUILD_BANS, GUILD_MESSAGES, GUILD_MESSAGE_REACTIONS, GUILD_VOICE_STATES } = require('./lib/constants').intents;
// NPM Packages
const { Timestamp } = require('@skyra/timestamp');
const Flipnote = require('alexflipnote.js');
const google = require('google-it');
const {
    AkairoClient,
    CommandHandler,
    ListenerHandler,
    InhibitorHandler,
    MongooseProvider
} = require('discord-akairo');
// Custom classes
const { clientColor, logo, christmasLogo, id } = require('./lib/constants');
const model = require('./src/models/clientSchema');
const Util = require('./lib/structures/Util');
const Cli = require('./lib/classes/Cli');
const Logger = require('./lib/log');
// Configuration
const config = require('./src/config');
require('dotenv').config();
// Instantiating extensions
require('./lib/extensions');

class RadaClient extends AkairoClient {
    constructor() {
        super({
            ownerID: config.owners
        }, {
            disableMentions: 'everyone',
            fetchAllMembers: false,
            partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
            ws: {
                intents: GUILDS | GUILD_MEMBERS | GUILD_BANS | GUILD_MESSAGES | GUILD_MESSAGE_REACTIONS | GUILD_VOICE_STATES,
                properties: {
                    $browser: "Discord iOS"
                }
            }
        });
        this.settings = new MongooseProvider(model);
        this.commandHandler = new CommandHandler(this, {
            directory: './src/commands/',
            prefix: (message) => {
                if (message.guild) {
                    return this.settings.get(message.guild.id, 'prefix', message.guild.prefix)
                }
                return config.production ? config.prefix : config.devPrefix;
            },
            ignoreCooldown: [],
            blockBots: true,
            allowMention: true,
            handleEdits: true,
            commandUtil: true
        });
        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: './src/inhibitors/'
        });
        this.listenerHandler = new ListenerHandler(this, {
            directory: './src/listeners/'
        });
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            listenerHandler: this.listenerHandler
        });
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.loadAll();
        this.inhibitorHandler.loadAll();
        this.commandHandler.loadAll();
        this.color = clientColor;
        this.avatar = new Date().getMonth() === 11 ? christmasLogo : logo;
        this.setMaxListeners(30);
        this.log = new Logger;
        this.Cli = new Cli(this);
        this.Util = Util;
        this.flipnote = new Flipnote(process.env.FLIPNOTE);
        this.Timestamp = Timestamp;
        this.id = id;
        this.defaultPrefix = config.production ? config.prefix : config.devPrefix;
        this.contributorRole = '789310316105170945';
        this.settings.addContributor = async(user) => {
            let array = [];
            let db = this.settings.get(this.id, 'contributors', array);
            if (db.length < 1) {
                array.push(user);
            } else {
                for (let i = 0; i < db.length; i++) {
                    array.push(db[i]);
                }
                array.push(user);
            }
            await this.settings.set(this.id, 'contributors', array);
        }
    }
    async login(token) {
        await this.settings.init();
        return super.login(token);
    }
    async search(query, results) {
        return await google({ 'query': query, 'no-display': true, 'limit': results });
    }
    daysBetween(startDate, endDate) {
        if (!endDate) endDate = Date.now();
        const treatAsUTC = (date) => {
            let result = new Date(date);
            result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
            return result;
        };
        let millisecondsPerDay = 24 * 60 * 60 * 1000;
        return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
    }
    chunkify(input, chunkSize) {
        const output = [];
        for (let i = 0; i < input.length; i += chunkSize) {
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
    reverse(str) {
        return str.split("").reverse().join("");
    }
    convertMs(time) {
        const conversion = (ms) => {
            let d, h, m, s;
            s = Math.floor(ms / 1000);
            m = Math.floor(s / 60);
            s = s % 60;
            h = Math.floor(m / 60);
            m = m % 24;
            d = Math.floor(h / 24);
            h = h % 24;
            return {
                d: d,
                h: h,
                m: m,
                s: s
            };
        };
        let u = conversion(time);
        let uptime;
        if (u.s) uptime = `${u.s} second${u.s < 2 ? '' : 's'}`;
        if (u.m) uptime = `${u.m} minute${u.m > 0 && u.m < 2 ? '' : 's'} and ${u.s} second${u.s > 0 && u.s < 2 ? '' : 's'}`;;
        if (u.h) uptime = `${u.h} hour${u.h > 0 && u.h < 2 ? '' : 's'}, ${u.m} minute${u.m > 0 && u.m < 2 ? '' : 's'} and ${u.s} second${u.s > 0 && u.s < 2 ? '' : 's'}`;
        if (u.d) uptime = `${u.d} day${u.d > 0 && u.d < 2 ? '' : 's'}, ${u.h} hour${u.h > 0 && u.h < 2 ? '' : 's'}, ${u.m} minute${u.m > 0 && u.m < 2 ? '' : 's'} and ${u.s} second${u.s > 0 && u.s < 2 ? '' : 's'}`;

        return uptime;
    }
    emojify(text) {
        const specialCodes = {
            '0': ':zero:',
            '1': ':one:',
            '2': ':two:',
            '3': ':three:',
            '4': ':four:',
            '5': ':five:',
            '6': ':six:',
            '7': ':seven:',
            '8': ':eight:',
            '9': ':nine:',
            '#': ':hash:',
            '*': '*️⃣',
            '?': ':grey_question:',
            '!': ':grey_exclamation:',
            ' ': '   ',
            '.': ':white_small_square:'
        }
        return text.toLowerCase().split('').map(letter => {
            if (/[a-z]/g.test(letter)) {
                return `:regional_indicator_${letter}: `
            } else if (specialCodes[letter]) {
                return `${specialCodes[letter]} `
            }
            return letter
        }).join('');
    }
    leet(text) {
        const leetMap = {
            a: { translated: '4' },
            b: { translated: 'B' },
            c: { translated: 'C' },
            d: { translated: 'D' },
            e: { translated: '3' },
            f: { translated: 'F' },
            g: { translated: 'G' },
            h: { translated: 'H' },
            i: { translated: '1' },
            j: { translated: 'J' },
            k: { translated: 'K' },
            l: { translated: 'L' },
            m: { translated: 'M' },
            n: { translated: 'N' },
            o: { translated: '0' },
            p: { translated: 'P' },
            q: { translated: 'Q' },
            r: { translated: 'R' },
            s: { translated: 'S' },
            t: { translated: 'T' },
            u: { translated: 'U' },
            v: { translated: 'V' },
            w: { translated: 'W' },
            x: { translated: 'X' },
            y: { translated: 'Y' },
            z: { translated: 'Z' }
        };
        return text
            .split('')
            .map(char => {
                const mappedChar = leetMap[char.toLowerCase()];
                return mappedChar ? mappedChar['translated'] : char
            }).join('');
    }
    owofy(string) {
        const { OwOfy } = require('./lib/constants')
        let i = Math.floor(Math.random() * OwOfy.length);

        string = string.replace(/(?:l|r)/g, 'w');
        string = string.replace(/(?:L|R)/g, 'W');
        string = string.replace(/n([aeiou])/g, 'ny$1');
        string = string.replace(/N([aeiou])/g, 'Ny$1');
        string = string.replace(/N([AEIOU])/g, 'Ny$1');
        string = string.replace(/ove/g, 'uv');
        string = string.replace(/!+/g, ` ${OwOfy[i]} `);
        string = string.replace(/\.+/g, ` ${OwOfy[i]} `);
        string = string.replace(/~+/g, ` ${OwOfy[i]} `);

        return string;
    };
    vaporwave(text) {
        return text.split('').map(char => {
            const code = char.charCodeAt(0)
            return code >= 33 && code <= 126 ? String.fromCharCode((code - 33) + 65281) : char
        }).join('').replace(/\s/g, '  ');
    }
}
const client = new RadaClient();
client.login(process.env.TOKEN);