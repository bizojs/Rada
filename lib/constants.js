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
        success: !production ? '<:RadaDevCheck:822833296198991882> ' : '<:RadaCheck:778555383769595914>',
        error: !production ? '<:RadaDevX:822833296181690388>' : '<:RadaX:778555383777853440>',
        info: !production ? '<:RadaDevInfo:822833296278552676>' : '<:RadaInfo:778555383807606804>',
        checked: '<:not_crossed:817025476895178823><:checked:817025531378794517>',
        unchecked: '<:crossed:817025436886368276><:not_checked:817025572605263893>',
    },
    reactions: {
        id: {
            success: !production ? '822833296198991882' : '778555383769595914',
            error: !production ? '822833296181690388' : '778555383777853440',
            info: !production ? '822833296278552676' : '778555383807606804'
        },
        success: !production ? 'RadaDevCheck:822833296198991882' : 'RadaCheck:778555383769595914',
        error: !production ? 'RadaDevX:822833296181690388' : 'RadaX:778555383777853440',
        info: !production ? 'RadaDevInfo:822833296278552676' : 'RadaInfo:778555383807606804'
    },
    clientColor: !production ? '#FCFAFF' : '#f05151',
    logo: !production ? 'https://cdn.br4d.vip/RadaDev' : 'https://cdn.br4d.vip/Rada',
    christmasLogo: !production ? 'https://cdn.br4d.vip/RadaDevChristmas' : 'https://cdn.br4d.vip/RadaChristmas',
    id: !production ? '729314273016283167' : '729013058860744814',
    badges: {
        'DISCORD_EMPLOYEE': '<:discord_employee:787834727646101544>',
        'PARTNERED_SERVER_OWNER': '<:partner:787833472534052865>',
        'HYPESQUAD_EVENTS': '<:hypesquad_events:787835021108707358>',
        'BUGHUNTER_LEVEL_1': '<:bughunterlvl1:787834135833870346>',
        'HOUSE_BRAVERY': '<:bravery:787833549235552266> ',
        'HOUSE_BRILLIANCE': '<:brilliance:787833837748355112> ',
        'HOUSE_BALANCE': '<:balance:787833580973195284>',
        'EARLY_SUPPORTER': '<:early_supporter:787834347821989898>',
        'BUGHUNTER_LEVEL_2': '<:bughunterlvl2:787834627083075625>',
        'EARLY_VERIFIED_DEVELOPER': '<:verified:787833433807650826>',
        'NITRO': '<:nitro:787836086838624266>'
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