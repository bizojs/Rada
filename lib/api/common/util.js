const fetch = require('node-fetch');
const ReminderHistory = require('../../../lib/classes/RadaReminderHistory');

class RadaAPISettings {
    todo;
    warnings;
    constructor(todo, warnings) {
        this.todo = todo;
        this.warnings = warnings;
    }
}


exports.verifyUser = async function(userToken) {
    const request = await fetch('http://discordapp.com/api/users/@me', {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    });
    const res = await request.json();
    return res.message === "401: Unauthorized" ? false : true ;
}
exports.getMutuals = function(guilds, client) {
    try {
        let mutuals = client.guilds.cache.filter(g => guilds.some(guild => g.id === guild.id)).map(g => g)
        return mutuals.length > 0 ? mutuals : [];
    } catch (e) {
        return null;
    }
}

exports.getReminders = async function(userId, client) {
    try {
        let user = client.users.cache.get(userId)
        let history = new ReminderHistory(user);
        history.populate(); // This is required to populate data
        return {
            current: Array.from(user.reminders.current),
            old: user.reminders.old
        };
    } catch (e) {
        return {
            current: [],
            old: []
        }
    }
}

exports.clearReminders = async function(userId, client) {
    try {
        let fetching = await client.users.fetch(userId)
        let user = client.users.cache.get(fetching.id)
        client.RadaReminder.clear(user);
        client.RadaReminder.clearSaved(user);
        return true;
    } catch (e) {
        return e.message;
    }
}

exports.getPrefix = async function(client, guild) {
    try {
        let server = client.guilds.cache.get(guild)
        let prefix = await client.settings.get(server.id, 'prefix', server.prefix)
        return prefix;
    } catch (e) {
        return client.guilds.cache.get(guild).prefix;
    }
}

exports.setPrefix = async function(client, guild, newPrefix) {
    await client.settings.set(guild, 'prefix', newPrefix);
    return true;
}

exports.getLogs = function(client, guild) {
    try {
        let server = client.guilds.cache.get(guild)
        return server.settings.get(server.id, 'logs', false) ? server.channels.cache.get(server.settings.get(server.id, 'logs')) : null
    } catch (e) {
        return null;
    }
}
exports.setLogs = async function(client, guild, channel) {
    let server = client.guilds.cache.get(guild)
    await server.settings.set(server.id, 'logs', channel === 'null' ? null : channel);
    return true;
}

exports.getVoteChannel = function(client, guild) {
    try {
        let server = client.guilds.cache.get(guild)
        return server.settings.get(server.id, 'vote', false) ? server.channels.cache.get(server.settings.get(server.id, 'vote')) : null
    } catch (e) {
        return null;
    }
}
exports.setVoteChannel = async function(client, guild, channel) {
    let server = client.guilds.cache.get(guild)
    await server.settings.set(server.id, 'vote', channel === 'null' ? null : channel);
    return true;
}

// exports.getVoteChannel = function(client, guild) {
//     try {
//         let server = client.guilds.cache.get(guild)
//         return server.settings.items.get(server.id).vote ? server.channels.cache.get(server.settings.items.get(server.id).vote) : null
//     } catch (e) {
//         return null;
//     }
// }

exports.getWelcomeChannel = function(client, guild) {
    try {
        let server = client.guilds.cache.get(guild)
        return server.settings.get(server.id, 'wc', false) ? server.channels.cache.get(server.settings.get(server.id, 'wc', false)) : null
    } catch (e) {
        return null;
    }
}
exports.setWelcomeChannel = async function(client, guild, channel) {
    let server = client.guilds.cache.get(guild)
    await server.settings.set(server.id, 'wc', channel === 'null' ? null : channel);
    return true;
}

exports.getWelcomeMessage = function(client, guild) {
    try {
        let server = client.guilds.cache.get(guild)
        return server.settings.get(server.id, 'jm', false) ? server.settings.get(server.id, 'jm', false) : null
    } catch (e) {
        return null;
    }
}
exports.setWelcomeMessage = async function(client, guild, msg) {
    console.log(msg)
    let server = client.guilds.cache.get(guild)
    await server.settings.set(server.id, 'jm', msg === "null" ? null : msg);
    return true;
}

exports.getLeaveMessage = function(client, guild) {
    try {
        let server = client.guilds.cache.get(guild)
        return server.settings.get(server.id, 'lm', false) ? server.settings.get(server.id, 'lm', false) : null
    } catch (e) {
        return null;
    }
}
exports.setLeaveMessage = async function(client, guild, msg) {
    let server = client.guilds.cache.get(guild)
    await server.settings.set(server.id, 'lm', msg === "null" ? null : msg);
    return true;
}

exports.getAutorole = function(client, guild) {
    try {
        let server = client.guilds.cache.get(guild)
        let role = server.roles.cache.get(server.settings.get(server.id, 'autorole', null));
        return role ?
        {
            role: role,
            color: role.hexColor === "#000000" ? "#7289da" : role.hexColor
        } : null
    } catch (e) {
        return null;
    }
}

exports.setAutorole = async function(client, guild, newRole) {
    let server = client.guilds.cache.get(guild)
    await server.settings.set(server.id, 'autorole', newRole);
    return true;
}

exports.getAntilink = function(client, guild) {
    try {
        let server = client.guilds.cache.get(guild)
        let antilink = server.settings.get(server.id, 'antilink', 'off')
        return antilink;
    } catch (e) {
        return 'off';
    }
}

exports.setAntilink = async function(client, guild, option) {
    let server = client.guilds.cache.get(guild)
    await server.settings.set(server.id, 'antilink', option);
    return true;
}

// Misc functions
exports.getChannels = function(client, guildID) {
    let channels = client.guilds.cache.get(guildID).channels.cache
        .filter(c => c.type === "text")
        .filter(c => c.permissionsFor(client.guilds.cache.get(guildID).me).has(3072))
        .map(g => g);
    return channels.length > 0 ? channels : [];
}
exports.getRoles = function(client, guildID) {
    let channels = client.guilds.cache.get(guildID).roles.cache
        .filter(r => !r.managed)
        .filter(r => r.position < client.guilds.cache.get(guildID).me.roles.highest.position)
        .filter(r => r.id !== guildID)
        .map(g => g);
    return channels.length > 0 ? channels : [];
}

exports.getUser = async function(id, client) {
    try {
        let caching = await client.users.fetch(id)
        return client.users.cache.get(caching.id)
    }  catch (e) {
        return null
    }
}

exports.getSettingsForMember = function(id, guild) {
    return guild.members.cache.get(id).settings.items.get(id)
}