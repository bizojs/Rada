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
        let fetched = await client.users.fetch(id);
        let user = client.users.cache.get(fetched.id);
        
        let mutualGuilds = client.guilds.cache
            .filter(g => g.members.cache.has(user.id))
        return mutualGuilds.size > 0 ? mutualGuilds : [];
    } catch (e) {
       return []
    }
}



// exports.getMutuals = async function(id, client) {
//     try {
//         let fetched = await client.users.fetch(id);
//         let user = client.users.cache.get(fetched.id);
//         let mutualGuilds = client.guilds.cache.filter(g => g.members.fetch(user?.id));
//         // let caching = await client.users.fetch(id)
//         // let user = client.users.cache.get(caching.id)
//         // let mutualGuilds = client.guilds.cache.filter(g => !g.members.cache.has(id)).map(g => g) ?
//         //     client.guilds.cache.filter(g => !g.members.cache.has(id)).map(g => g) :
//         //     [];
//         console.log(mutualGuilds.map(g => g.name))
//         return mutualGuilds.size > 0 ? mutualGuilds : [];
//     } catch (e) {
//        return []
//     }
// }

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