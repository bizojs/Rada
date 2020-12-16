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
	commandStarted(user, command, guild) {
		console.log(`${colors.bgGray(` ${new Date().toLocaleTimeString()} `)}${colors.black.bgYellow(' [Command.Run] ')}${colors.black.bgWhite(` ${user} `)}${colors.black.bgRed(` ${command} `)}${colors.black.bgGreen(` ${guild} `)}`)
	}
	newSong(type, song, guild) {
		console.log(`${colors.bgGray(` ${new Date().toLocaleTimeString()} `)}${colors.bgCyan.white(' ▶ ')}${colors.black.bgWhite(` ${type} `)}${colors.brightRed.bgWhite(`${song}`)}${colors.black.bgWhite(' is now playing in ')}${colors.black.bgGreen(` ${guild.name}[${guild.id}] `)}`);
	}
}

module.exports = CustomLog;
