const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class BoostInfoCommand extends Command {
    constructor() {
        super('boostinfo', {
           aliases: ['boostinfo'],
           category: 'Miscellaneous',
           description: 'Get information about the server boosts.',
        });
    }

    async exec(message) {
        let specialFeatures = message.guild.features.map(feat => feat.split('_').join(' ').toLowerCase()).join('\n');
        let splashURL = message.guild.splashURL({format: 'png', size: 2048});
        let bannerURL = message.guild.bannerURL({format: 'png', size: 2048});
        let levelOne = 2; let levelTwo = 15; let levelThree = 30;
        let currentBoosts = message.guild.premiumSubscriptionCount;
        let currentLevel = message.guild.premiumTier;
        let nextTier = message.guild.premiumTier + 1;
        let boostsUntil;
        if (currentLevel === 0) boostsUntil = levelOne - currentBoosts;
        if (currentLevel === 1) boostsUntil = levelTwo - currentBoosts;
        if (currentLevel === 2) boostsUntil = levelThree - currentBoosts;
        if (currentLevel === 3) boostsUntil = `Max boost level reached`;

        this.icon = {
            0: 'https://i.imgur.com/msExGMY.png',
            1: 'https://i.imgur.com/xFeg9xC.png',
            2: 'https://i.imgur.com/4xLB6pG.png',
            3: 'https://i.imgur.com/sDJwTdF.png',
        };

        for (let i = 0; i < 5; i++);
        let numberedBoosters = [...message.guild.members.cache.values()]
            .filter(m => m.premiumSinceTimestamp > 0)
            .map(m => [ m.user.tag, m.premiumSinceTimestamp ])
            .sort((a, b) => b[1] - a[1])
            .map((e, i) => `\`${i + 1}.\` ${e[0]} (Boosted **${this.client.daysBetween(new Date(e[1])).toFixed(0)} days ago**)`).join(`\n`);

        let longestBoost = [...message.guild.members.cache.values()]
            .filter(m => m.premiumSinceTimestamp > 0)
            .map(m => this.client.daysBetween(new Date(m.premiumSinceTimestamp)).toFixed(0))
            .sort((a, b) => b[0] - a[1])[0]

        const embed = new MessageEmbed()
            .setTimestamp()
            .setColor(this.client.color)
            .setTitle(`${message.guild.name} Nitro Boost stats`)
            .setThumbnail(this.icon[message.guild.premiumTier])
            .addField(`Boosts`, message.guild.premiumSubscriptionCount, true)
            .addField(`Tier`, message.guild.premiumTier, true)
            .addField(`Boosts until __Tier ${nextTier}__`, `${boostsUntil}`, true)
        if (splashURL) embed.addField(`Splash URL`, `[Link](${splashURL})`, true)
        if (bannerURL) embed.addField(`Banner URL`, `[Link](${bannerURL})`, true)
        if (message.guild.vanityURLCode) embed.addField(`Vanity URL`, `https://discord.gg/${message.guild.vanityURLCode}`, true)
        if (message.guild.features.length > 0) embed.addField(`Features`, specialFeatures)
        if (message.guild.premiumSubscriptionCount > 0) {
            embed.addField(`Boosters`, numberedBoosters)
                 .setFooter(`The longest boost is ${longestBoost} days!`)
        }
        return message.channel.send(embed);
    }
}

module.exports = BoostInfoCommand;