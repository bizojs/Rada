const { prod } = require('mathjs');
const { production } = require('../src/config');

module.exports = {
    color: {
        VERY_NEGATIVE: 'CC4625',
        NEGATIVE: 'E69539',
        SLIGHTLY_NEGATIVE: 'E6C72E',
        POSITIVE: '13CC6A',
        INFORMATION: '3D90E6'
    },
    poll: {
		1: '1️⃣',
		2: '2️⃣',
		3: '3️⃣',
		4: '4️⃣',
		5: '5️⃣',
		6: '6️⃣',
		7: '7️⃣',
		8: '8️⃣',
		9: '9️⃣',
		10: '🔟'
	},
	emotes: {
        success: !production ? '<:RadaDevCheck:778555383345184809> ' : '<:RadaCheck:778555383769595914>',
        error: !production ? '<:RadaDevX:778555383815077888>' : '<:RadaX:778555383777853440>',
        info: !production ? '<:RadaDevInfo:778555383409016845>' : '<:RadaInfo:778555383807606804>'
	},
	reactions: {
        success: !production ? 'RadaDevCheck:778555383345184809' : 'RadaCheck:778555383769595914',
        error: !production ? 'RadaDevX:778555383815077888' : 'RadaX:778555383777853440',
        info: !production ? 'RadaDevInfo:778555383409016845' : 'RadaInfo:778555383807606804'
	},
	clientColor: !production ? '#55FFCD' : '#f05151',
	logo: !production ? 'https://i.br4d.vip/kkCkZlLP.png' : 'https://i.br4d.vip/Lm9zTuY5.png'
};