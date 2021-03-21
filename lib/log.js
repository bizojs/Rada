const colors = require('colors');
class CustomLog {

    log = (message) => {
            console.log(`${colors.bgGray(` ${new Date().toLocaleTimeString()} `)} ${message}`);
		return true;
	}
	success = (message) => {
		console.log(`${colors.bgGray(` ${new Date().toLocaleTimeString()} `)}${colors.bgGreen.white(' ✓ ')} ${message}`);
		return true;
	}
	shardLogin = (message) => {
		console.log(`${colors.bgGray(`\n ${new Date().toLocaleTimeString()} `)}${colors.bgGreen.white(' ✓ ')} ${message}`);
	}
	fail = (message) => {
		console.log(`${colors.bgGray(` ${new Date().toLocaleTimeString()} `)}${colors.bgRed.white(' ✘ ')} ${message}`);
		return true;
	}

	rateLimit = (RLInfo, client) => {
		console.log(`${colors.bgGray(` ${new Date().toLocaleTimeString()} `)}${colors.bgRed.white(' ! ')} [SpamWarning] ${client.user.username} is being ratelimited on method ${colors.underline(RLInfo.method)} ➜ ${colors.brightBlue(RLInfo.path)}`);
	}

	commandStarted(user, command, guild) {
		console.log(`${colors.bgGray(` ${new Date().toLocaleTimeString()} `)}${colors.bgBrightBlue.white(' - ')} Command ran by ${colors.underline(user)} in ${colors.underline(guild)} ➜  ${colors.brightBlue(command)}`)
	}

	debug(info) {
		console.log(`${colors.bgGray(` ${new Date().toLocaleTimeString()} `)}${colors.bgBrightYellow.white(' ! ')} ${info}`);
	}

	warn(info) {
		console.log(`${colors.bgGray(` ${new Date().toLocaleTimeString()} `)}${colors.bgYellow.white(' ⚠ ')} ${info}`);
	}
}

module.exports = CustomLog;