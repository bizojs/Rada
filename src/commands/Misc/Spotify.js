const { Command } = require('discord-akairo');
const req = require('@aero/centra');
const { json } = require('mathjs');

module.exports = class SpotifyCommand extends Command {
    constructor() {
        super('spotify', {
            category: 'Miscellaneous',
            id: 'spotify',
            aliases: ['spotify'],
            description: {
                content: 'Search for a song on spotify',
                permissions: ['EMBED_LINKS']
            },
            args: [{
                id: 'query',
                type: 'string',
                match: 'rest'
            }],
            clientPermissions: ['EMBED_LINKS']
        })
        this.color = '#1DD05D';
        this.spotifyLogo = 'https://cdn.br4d.vip/spotify.png';
        this.spotifyWsLogo = 'https://cdn.br4d.vip/spotify-ws.png';
        this.baseUrl = 'https://s.brys.tk';
    }
    async exec(message, args) {
        if (!args.query) {
            return message.util.send(this.spotifyEmbed('Spotify search').setDescription('You must enter a song name / artist to search or enter \`popular\` to browse what\'s popular at the moment.'));
        }
        const query = args.query.split(/\s+/).join('%20');

        if (args.query.toLowerCase() === 'popular') {
            const popular = await req(`${this.baseUrl}/new?limit=10`).json();
            let embeds = [];
            for (let i = 0; i < popular.new.length; i++) {
                let embed = this.spotifyEmbed('Spotify popular now')
                    .addField('Name', popular.new[i].name)
                    .addField('Artists', this.client.Util.isArray(popular.new[i].artists) ? popular.new[i].artists.join(', ') : popular.new[i].artists)
                    .addField('Type', popular.new[i].total_tracks > 1 ? 'Album' : 'Single')
                    .setThumbnail(popular.new[i].image)
                    .setFooter(`Page ${i+1} of ${popular.new.length} | Requested by ${message.author.username}`)
                    .setTimestamp()
                if (popular.new[i].total_tracks > 1) {
                    embed.addField('Songs', popular.new[i].tracks.map((i, e) => `**${e+1}**. ${i}`).join('\n'))
                }
                embeds.push(embed);
            }
            message.paginate(embeds);
        } else {
            const search = await req(`${this.baseUrl}/search?q=${query}`).json();
            if (search.search.length < 1) {
                return message.util.send(this.spotifyEmbed().setDescription('There was no results for your query, please try again with something different'));
            }
            let track = search.search[0];
            let embed = this.spotifyEmbed('Spotify search')
                .setDescription('Your search results matched a song')
                .addField('Song', `[${track.converted_trk}](https://open.spotify.com/track/${track.id})`)
                .addField('Popularity', track.popularity)
                .addField('Explicit', track.explicit ? message.emotes.checked : message.emotes.unchecked)
                .addField('Song length', this.client.convertMs(track.duration, true))
                .setThumbnail(track.artwork)
            return message.util.send(embed)
        }
    }
    spotifyEmbed(title) {
        return this.client.util.embed()
            .setAuthor(title, this.spotifyLogo)
            .setColor(this.color)
            .setFooter(this.baseUrl, this.spotifyWsLogo)
            .setTimestamp();
    }
}