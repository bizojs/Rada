let sensitivePattern;

class Util {
	constructor() {
		throw new Error('This class may not be initiated with new');
    }
    
    static codeBlock(language, text) {
		  return `\`\`\`${language}\n${text || String.fromCharCode(8203)}\`\`\``;
    }
    static clean(text, token) {
		  return text.replace(token, '███████████████████████');
    }
    static toTitleCase(str) {
		  return str.replace(/[A-Za-zÀ-ÖØ-öø-ÿ]\S*/g, (txt) => Util.titleCaseVariants[txt] || txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
    static toSnakeCase(str) {
		  return str.split(/\s/g).join('_');
    }
    static trimString(str, max = 30) {
      if (str.length > max) return `${str.substr(0, max)}...`;
      return str;
    }
    static random(n1, n2) {
      Math.floor(Math.random() * (n2 - n1)) + n1;
    }
    static randomArray(array) {
      array[this.random(0, array.length)];
    }
    static isUnicodeEmoji(str) {
      return /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c([\ud000-\udfff]){1,2}|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])$/.test(str);
    }
    static isFunction(input) {
		  return typeof input === 'function';
	}
    static isObject(input) {
        return input && input.constructor === Object;
    }
    static isThenable(input) {
		  if (!input) return false;
		  return (input instanceof Promise) || (input !== Promise.prototype && Util.isFunction(input.then) && Util.isFunction(input.catch));
    }
    static generateID() {
      return Date.now().toString(35).toUpperCase();
    }
}

Util.titleCaseVariants = {
	textchannel: 'TextChannel',
	voicechannel: 'VoiceChannel',
	categorychannel: 'CategoryChannel',
	guildmember: 'GuildMember'
};

module.exports = Util;