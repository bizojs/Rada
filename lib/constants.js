const { prod } = require('mathjs');
const { production } = require('../src/config');

module.exports = {
    color: {
        fatal: 'CC4625',
        error: 'E69539',
        warn: 'E6C72E',
        success: '13CC6A',
        info: '3D90E6'
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
	logo: !production ? 'https://i.br4d.vip/kkCkZlLP.png' : 'https://i.br4d.vip/Lm9zTuY5.png',
	christmasLogo: !production ? 'https://i.br4d.vip/aZhqll4N.png' : 'https://i.br4d.vip/6DyNZVZn.png',
	intents: {
		GUILDS: 1 << 0,
		/*
		 * GUILD_CREATE
		 * GUILD_DELETE
		 * GUILD_ROLE_CREATE
		 * GUILD_ROLE_UPDATE
		 * GUILD_ROLE_DELETE
		 * CHANNEL_CREATE
		 * CHANNEL_UPDATE
		 * CHANNEL_DELETE
		 * CHANNEL_PINS_UPDATE
		 */
		GUILD_MEMBERS: 1 << 1,
		/*
		 * GUILD_MEMBER_ADD
		 * GUILD_MEMBER_UPDATE
		 * GUILD_MEMBER_REMOVE
		 */
		GUILD_BANS: 1 << 2,
		/*
		 * GUILD_BAN_ADD
		 * GUILD_BAN_REMOVE
		 */
		GUILD_EMOJIS: 1 << 3,
		/*
		 * GUILD_EMOJIS_UPDATE
		 */
		GUILD_INTEGRATIONS: 1 << 4,
		/*
		 * GUILD_INTEGRATIONS_UPDATE
		 */
		GUILD_WEBHOOKS: 1 << 5,
		/*
		 * WEBHOOKS_UPDATE
		 */
		GUILD_INVITES: 1 << 6,
		/*
		 * INVITE_CREATE
		 * INVITE_DELETE
		 */
		GUILD_VOICE_STATES: 1 << 7,
		/*
		 * VOICE_STATE_UPDATE
		 */
		GUILD_PRESENCES: 1 << 8,
		/*
		 * PRESENCE_UPDATE
		 */
		GUILD_MESSAGES: 1 << 9,
		/*
		 * MESSAGE_CREATE
		 * MESSAGE_UPDATE
		 * MESSAGE_DELETE
		 */
		GUILD_MESSAGE_REACTIONS: 1 << 10,
		/*
		 * MESSAGE_REACTION_ADD
		 * MESSAGE_REACTION_REMOVE
		 * MESSAGE_REACTION_REMOVE_ALL
		 * MESSAGE_REACTION_REMOVE_EMOJI
		 */
		GUILD_MESSAGE_TYPING: 1 << 11,
		/*
		 * TYPING_START
		 */
		DIRECT_MESSAGES: 1 << 12,
		/*
		 * CHANNEL_CREATE
		 * MESSAGE_CREATE
		 * MESSAGE_UPDATE
		 * MESSAGE_DELETE
		 */
		DIRECT_MESSAGE_REACTIONS: 1 << 13,
		/*
		 * MESSAGE_REACTION_ADD
		 * MESSAGE_REACTION_REMOVE
		 * MESSAGE_REACTION_REMOVE_ALL
		 * MESSAGE_REACTION_REMOVE_EMOJI
		 */
		DIRECT_MESSAGE_TYPING: 1 << 14
		/*
		 * TYPING_START
		 */
	},
	OwOfy: [
		'(*^ω^)',
		'(◕‿◕✿)',
		'(◕ᴥ◕)',
		'ʕ•ᴥ•ʔ',
		'ʕ￫ᴥ￩ʔ',
		'(*^.^*)',
		'owo',
		'(｡♥‿♥｡)',
		'uwu',
		'(*￣з￣)',
		'>w<',
		'^w^',
		'(つ✧ω✧)つ',
		'(/ =ω=)/',
		'>~<'
	]
};