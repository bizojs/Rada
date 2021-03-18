const { Listener } = require('discord-akairo');

module.exports = class voiceStateUpdate extends Listener {
    constructor() {
        super('voiceStateUpdate', {
            emitter: 'client',
            event: 'voiceStateUpdate'
        });
    }

    exec(oldMember, newMember) {
        let logs = oldMember.guild.channels.cache.get(oldMember.guild.settings.get(oldMember.guild.id, 'logs'));
        let VoiceStatusUpdate = this.client.emojis.cache.find(e => e.name === "voice_channel");
        let UnmutedEmote = this.client.emojis.cache.find(e => e.name === "unmuted");
        let MutedEmote = this.client.emojis.cache.find(e => e.name === "muted");
        let DeafenedEmote = this.client.emojis.cache.find(e => e.name === "deafened");
        let UndeafenedEmote = this.client.emojis.cache.find(e => e.name === "undeafened");
        let GoLiveEmote = this.client.emojis.cache.find(e => e.name === "go_live");
        let user = this.client.users.cache.get(oldMember.id);
        let embed = this.client.util.embed()
            .setColor(this.client.color)
            .setAuthor('Voice update', VoiceStatusUpdate.url)
            .setTimestamp()
        if (logs) {
            if (oldMember.serverMute !== newMember.serverMute && oldMember.channelID === newMember.channelID) {
                embed.setDescription(`**${user.tag}** is ${oldMember.serverMute ? 'no longer' : 'now'} server muted ${oldMember.serverMute ? UnmutedEmote : MutedEmote}`)
                return logs.send(embed);
            }
            if (oldMember.serverDeaf !== newMember.serverDeaf && oldMember.channelID === newMember.channelID) {
                embed.setDescription(`**${user.tag}** is ${oldMember.serverDeaf ? 'no longer' : 'now'} server deafened ${oldMember.serverDeaf ? UndeafenedEmote : DeafenedEmote}`)
                return logs.send(embed);
            }
            if (oldMember.selfMute !== newMember.selfMute && oldMember.channelID === newMember.channelID) {
                embed.setDescription(`**${user.tag}** is ${newMember.selfMute ? 'now' : 'no longer'} muted ${newMember.selfMute ? MutedEmote : UnmutedEmote}`)
                return logs.send(embed);
            }
            if (oldMember.selfDeaf !== newMember.selfDeaf && oldMember.channelID === newMember.channelID) {
                embed.setDescription(`**${user.tag}** is ${newMember.selfDeaf ? 'now' : 'no longer'} deafened ${oldMember.selfDeaf ? UndeafenedEmote : DeafenedEmote}`)
                return logs.send(embed);
            }
            if (oldMember.streaming !== newMember.streaming) {
                embed.setDescription(`**${user.tag}** has ${newMember.streaming ? 'started' : 'stopped'} streaming with **GoLive** ${GoLiveEmote}`)
                return logs.send(embed);
            }
            if (oldMember.channelID !== newMember.channelID) {
                let user = oldMember.guild.members.cache.get(newMember.id).user;
                if (oldMember.channelID && !newMember.channelID) {
                    let channel = oldMember.guild.channels.cache.get(oldMember.channelID);
                    embed.setDescription(`**${user.tag}** has just left the voice channel **${channel.name}** \`[${channel.id}]\``)
                    return logs.send(embed);
                } else if (newMember.channelID && !oldMember.channelID) {
                    let channel = oldMember.guild.channels.cache.get(newMember.channelID);
                    embed.setDescription(`**${user.tag}** has just joined the voice channel **${channel.name}** \`[${channel.id}]\``)
                    return logs.send(embed);
                } else {
                    let oldChannel = oldMember.guild.channels.cache.get(oldMember.channelID);
                    let newChannel = oldMember.guild.channels.cache.get(newMember.channelID);
                    embed.setDescription(`**${user.tag}** has just switched voice channels from **${oldChannel.name}** \`[${oldChannel.id}]\` to **${newChannel.name}** \`[${newChannel.id}]\``)
                    return logs.send(embed);
                }
            }
        }
    }
}