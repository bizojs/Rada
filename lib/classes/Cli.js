const { execSync } = require('child_process');
const inquirer = require('inquirer');
const colors = require('colors');
const os = require('os');

class Cli {

    constructor(client) {
		this.client = client;
    }

    async init() {
        this.client.log.success('CLI Class initialised');
    }

    async start() {
        console.log([
            `${colors.brightRed('──────────────────CLI Commands───────────────────')}`,
            colors.brightGreen('help') + '    : This message (can also type \'?\')',
            colors.brightGreen('ping') + '    : Response time to Discord',
            colors.brightGreen('stats') + '   : Statistics of Rada',
            colors.brightGreen('invite') + '  : Generate an invite to a guild',
            colors.brightGreen('stop') + '    : Stop the client process',
            `${colors.brightRed('─────────────────────────────────────────────────')}`
        ].join('\n'))
        this.runCommand();
    }

    async runCommand() {
        const input = await inquirer.prompt([
            {
                type: 'input',
                name: 'command',
                message: 'command' + ':'.brightRed,
                validate: val => this.commands().some(c => val.toLowerCase() === c.toLowerCase()) ? true : 'Please enter a valid command name'
            }
        ]);
        if (input.command.toLowerCase() === "help") return this.start();
        if (input.command.toLowerCase() === "?") return this.start();
        if (input.command.toLowerCase() === "ping") return this.ping();
        if (input.command.toLowerCase() === "stats") return this.stats();
        if (input.command.toLowerCase() === "invite") return this.invite();
        if (input.command.toLowerCase() === "stop") return this.stop();
    }

    /** Commands **/
    ping() {
        console.log(colors.brightRed('> ') + colors.brightWhite('My response time to discord is ') + colors.brightGreen(`${Math.round(this.client.ws.ping)} ms`));
        this.runCommand();
    }
    stats() {
        console.log([
            `${colors.brightRed('─────────────────────Stats───────────────────────')}`,
            'Users      : ' + `${this.client.guilds.cache.reduce((a, c) => a + c.memberCount, 0).toLocaleString()}`.brightGreen,
            'Guilds     : ' + `${this.client.guilds.cache.size}`.brightGreen,
            'OS         : ' + `${process.platform === 'linux' ? 'Ubuntu 18.04' : 'Windows 10'} ${process.arch}`.brightGreen,
            'CPU        : ' +  `${os.cpus()[0].model}`.brightGreen,
            'RAM Usage  : ' +  `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) > 1024 ? `${(process.memoryUsage().heapUsed / 1024 / 1024 / 1024).toFixed(2)} GB` : `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`} / ${(os.totalmem() / 1024 / 1024).toFixed(2) > 1024 ? `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB` : `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`}`.brightGreen,
            'CPU Usage  : ' +  `${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}%`.brightGreen,
            `${colors.brightRed('─────────────────────────────────────────────────')}`
        ].join('\n'));
        setTimeout(() => { this.runCommand() }, 1000);
    }

    async invite() {
        const input = await inquirer.prompt([
            {
                type: 'input',
                name: 'id',
                message: 'Guild Id' + ':'.brightRed,
                validate: val => !isNaN(val)
            }
        ]);
        try {
            let fetching = await this.client.guilds.fetch(input.id);
            let guild = this.client.guilds.cache.get(fetching.id);
            let channel = guild.channels.cache.filter(c => c.type === 'text' && c.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE')).first();
            channel.createInvite()
            .then(invite => {
                console.log(`✅ Created an invite in ${colors.brightGreen(`#${channel.name} (${guild.name})`)} with a code of ${colors.brightRed(`${invite.code}`)} (${colors.underline(`https://discord.gg/${invite.code}`)})`);
            })
            .catch(e => {
                console.log(`❌ ${e.message}`);
            })
            setTimeout(() => { this.runCommand() }, 2000);
        } catch (e) {
            console.log(`❌ Invalid guild ID: Try again`);
            this.invite();
        }
    }

    stop = () => process.exit();

    /** Command list **/
    commands = () => ['stats', 'stop', 'help', '?', 'invite', 'ping'];
	
}

module.exports = Cli;
