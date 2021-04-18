class RadaAPISettings {
    todo;
    warnings;
    constructor(todo, warnings) {
        this.todo = todo;
        this.warnings = warnings;
    }
}

exports.getMutuals = async function(id, client) {
    try {
        let caching = await client.users.fetch(id)
        let user = client.users.cache.get(caching.id)
        return client.guilds.cache.filter(g => !g.members.cache.has(user))
    } catch (e) {
       return null
    }
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