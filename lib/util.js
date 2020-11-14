const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

exports.trimString = (str, max = 30) => {
	if (str.length > max) return `${str.substr(0, max)}...`;
	return str;
};

exports.random = (n1, n2) => Math.floor(Math.random() * (n2 - n1)) + n1;

exports.randomArray = array => array[this.random(0, array.length)];

exports.objectIsEmpty = obj => Object.entries(obj).length === 0;

exports.isUnicodeEmoji = str => /^(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c([\ud000-\udfff]){1,2}|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])$/.test(str);

exports.base32 = int => {
	if (int === 0) {
		return alphabet[0];
	}

	let res = "";
	while (int > 0) {
		res = alphabet[int % 32] + res;
		int = Math.floor(int / 32);
	}
	return res;
}
