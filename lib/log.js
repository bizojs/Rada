const colors = require('colors');
class CustomLog {

	log = (message) => {
		console.log(`${colors.bgWhite.brightRed(`[${new Date().toLocaleTimeString()}]`)} ${message}`);
	}
	success = (message) => {
		console.log(`${colors.bgWhite.brightRed(`[${new Date().toLocaleTimeString()}]`)} ${colors.brightGreen('[✅]')} ${message}`);
	}
	fail = (message) => {
		console.log(`${colors.bgWhite.brightRed(`[${new Date().toLocaleTimeString()}]`)} ${colors.brightRed('[❎]')} ${message}`);
	}
	commandStarted(user, command, channel, guild) {
		console.log(`${colors.bgBlue(`[${new Date().toLocaleTimeString()}]`)} ${colors.black.bgYellow('[Command.Run]')} ${colors.black.bgWhite(user)} ${colors.black.bgRed(command)} ${colors.black.bgYellow(channel)} ${colors.black.bgGreen(guild)}`)
	}
	commandLoad(command, reload) {
		console.log(`${colors.bgBlue(`[${new Date().toLocaleTimeString()}]`)} ${colors.black.bgYellow(reload ? '[Command.Reload]' : '[Command.Load]')}  ${colors.black.bgRed(`(${command})`)} `)
	}
}

module.exports = CustomLog;
