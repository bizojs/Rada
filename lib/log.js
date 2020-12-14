const colors = require('colors');
class CustomLog {

	log = (message) => {
		console.log(`${colors.bgWhite.brightRed(`[${new Date().toLocaleTimeString()}]`)} ${message}`);
		return true;
	}
	success = (message) => {
		console.log(`${colors.bgGray(`[${new Date().toLocaleTimeString()}]`)} ${colors.bgGreen.white(' ✓ ')} ${message}`);
		return true;
	}
	shardLogin = (message) => {
		console.log(`${colors.bgGray(`\n[${new Date().toLocaleTimeString()}]`)} ${colors.bgGreen.white(' ✓ ')} ${message}`);
	}
	fail = (message) => {
		console.log(`${colors.bgGray(`[${new Date().toLocaleTimeString()}]`)} ${colors.bgRed.white(' ✘ ')} ${message}`);
		return true;
	}
	commandStarted(user, command, guild) {
		console.log(`${colors.bgGray(`[${new Date().toLocaleTimeString()}]`)} ${colors.black.bgYellow('[Command.Run]')} ${colors.black.bgWhite(user)} ${colors.black.bgRed(command)} ${colors.black.bgGreen(guild)}`)
	}
}

module.exports = CustomLog;
