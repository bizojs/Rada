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
                let afkStatus = await author.settings.get(author.id, 'afk', { afk: false, message: null, started: null });
                let afkSince = afkStatus.started;
                let afkPings = await author.settings.get(author.id, 'afkPings', []);
                if (afkStatus.afk) {
                    await author.settings.set(author.id, 'afk', { afk: false, message: null, started: null });
                    let embed = this.client.util.embed()
                        .setAuthor(`AFK ➜ ${message.author.username}`, message.author.avatarURL({ dynamic: true }))
                        .setDescription(`Your AFK mode has been turned off.${afkPings.length > 0 ? `\nWhile you was away, you was @mentioned **${afkPings.length} times**.\nDo you want to see the @mentions you got? (React below)` : ''}`)
                        .setColor(this.client.color)
                        .setFooter(`AFK for ${this.client.convertMs(Math.abs(new Date() - afkSince))}`)
            let msg = await message.channel.send(author, embed)
            if (afkPings.length < 1) return;
            const pages = this.client.chunkify(afkPings, 5);
            let embeds = [];
            for (let i = 0; i < pages.length; i++) {
                let embed = this.client.util.embed()
                    .setTitle('Your @mentions while you was AFK')
                    .setColor(this.client.color)
                    .setDescription(pages[i])
                    .setTimestamp()
                    .setFooter(`Page ${i+1} of ${pages.length} | Requested by ${message.author.username}`)
                embeds.push(embed);
            }
            for (const emoji of this.emojiList) await msg.react(emoji);

            const collector = msg.createReactionCollector((reaction, user) => 
                this.emojiList.includes(reaction.emoji.id)
                && !user.bot && user.id === author.id, { time: 30000 });
            
            collector.on('collect', async reaction => {
                reaction.users.remove(author);
                switch (reaction.emoji.id) {
                    case this.emojiList[0]:
                        try {
                            for (const embed of embeds) await message.author.send(embed);
                            msg.edit(msg.embeds[0].setDescription(`Your AFK mode has been turned off\nWhile you was away, you was mentioned **${afkPings.length} time${afkPings.length === 1 ? '' : 's'}**.\n\n${message.emotes.success} **Your @mentions have been send to you in DMs.**`))
                            await author.settings.set(author.id, 'afkPings', []);
                            collector.stop('success');
                        } catch (e) {
                            msg.edit(msg.embeds[0].setDescription(`Your AFK mode has been turned off\nWhile you was away, you was mentioned **${afkPings.length} time${afkPings.length === 1 ? '' : 's'}**.\n\n${message.emotes.info} **I was unable to dm you, here are your @mentions**`))
                            for (const embed of embeds) await message.channel.send(embed);
                            collector.stop('success');
                        }
                    break;
                    case this.emojiList[1]:
                        await author.settings.set(author.id, 'afkPings', []);
                        msg.edit(msg.embeds[0].setDescription(`Your AFK mode has been turned off\nWhile you was away, you was mentioned **${afkPings.length} time${afkPings.length === 1 ? '' : 's'}**.\n\n${message.emotes.success} **Your @mentions have been cleared.**`))
                        collector.stop('success');
                    break;
                    default:
                        collector.stop('success');
                    break;
                }
            });
            collector.on('end', async () => {
                await author.settings.set(author.id, 'afkPings', []);
                if (!msg.deleted && msg.guild.me.permissions.has('MANAGE_MESSAGES')) {
                    await msg.reactions.removeAll();
                }
            });
        }
    }
}