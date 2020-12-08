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
}

module.exports = CustomLog;
