const { Inhibitor } = require('discord-akairo');
const { production } = require('../config');

module.exports = class AFK extends Inhibitor {
        constructor() {
            super('afk', {
                type: 'all'
            });
            this.emojiList = [!production ? '778555383345184809' : '778555383769595914', !production ? '778555383815077888' : '778555383777853440'];
        }

        async exec(message) {
                if (message.author.bot) return;
                let user = await this.client.users.fetch(message.author.id);
                let author = this.client.users.cache.get(user.id);
                let afkStatus = await author.settings.get(author.id, 'afk', { afk: false, message: null });
                let afkPings = await author.settings.get(author.id, 'afkPings', []);
                if (afkStatus.afk) {
                    await author.settings.set(author.id, 'afk', { afk: false, message: null });
                    let embed = this.client.util.embed()
                        .setTitle('AFK')
                        .setDescription(`Your AFK mode has been turned off${afkPings.length > 0 ? `\nWhile you was away, you was mentioned **${afkPings.length} times**.\nDo you want to see the pings you got? (React below)` : ''}`)
                        .setColor(this.client.color)
                        .setTimestamp()
            let msg = await message.channel.send(`<@!${author.id}>`, embed)
            if (afkPings.length < 1) return;
            for (const emoji of this.emojiList) await msg.react(emoji);

            const collector = msg.createReactionCollector((reaction, user) => 
                this.emojiList.includes(reaction.emoji.id)
                && !user.bot && user.id === author.id, { time: 30000 });
            
            collector.on('collect', async reaction => {
                reaction.users.remove(author);
                switch (reaction.emoji.id) {
                    case this.emojiList[0]:
                        try {
                            author.send(afkPings.join('\n'));
                            message.channel.send('**Your mentions have been send to you in DMs.**');
                            await author.settings.set(author.id, 'afkPings', []);
                            collector.stop('success');
                        } catch (e) {
                            message.channel.send(`**${author.tag}** I was unable to dm you, here are your pings\n${afkPings.join('\n')}`);
                            collector.stop('success');
                        }
                    break;
                    case this.emojiList[1]:
                        await author.settings.set(author.id, 'afkPings', []);
                        message.channel.send('**Your mentions have been cleared.**');
                        collector.stop('success');
                    break;
                    default:
                        collector.stop('success');
                    break;
                }
            });
            collector.on('end', async () => {
                if (!msg.deleted && msg.guild.me.permissions.has('MANAGE_MESSAGES')) {
                    await msg.reactions.removeAll();
                }
            });
        }
    }
}