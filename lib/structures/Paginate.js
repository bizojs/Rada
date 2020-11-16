class Page {
    constructor(elements, index, pagesCount, format) {
        this.elements = elements
        this.index = index
        this.pagesCount = pagesCount
        if (format) {
            this.format = format

            this.content = JSON.stringify(this.format._apiTransform())
            this.content = this.content.replace(/\{pagesCount\}/g, this.pagesCount)
            this.content = this.content.replace(/\{pageIndex\}/g, this.index + 1)
            this.content = this.content.replace(/\{content\}/g, this.elements.join('\\n'))
            this.content = JSON.parse(this.content)
        }
    }
    build() {
        return this.content || this.elements
    }
}


var {
    EventEmitter
} = require('events');

class Pagination extends EventEmitter {
    constructor() {
        super()
        this.pages = [];
        this.ended = false;
        this.index = 0
        this.client;
        this.format;
        this.maxItemsPerPage;
        this.content;
        this.message;
        this.rawEvent = e => {
            if (e.t == "MESSAGE_REACTION_ADD") {
                if (!e.d.message_id == this.message.id) return;
                if (e.d.user_id == this.client.user.id) return;
                const fetching = this.client.users.fetch(e.d.user_id)
                const user = this.client.users.cache.get(fetching.id)
                this.message.reactions.cache.forEach(r => {
                    r.remove(user.id).catch(e => {})
                })
                this.emit('react', user, e.d.emoji)
            }
        }
        this.on('start', () => {
            this.client.setMaxListeners(this.client.getMaxListeners() + 1)
            this.client.on('raw', this.rawEvent)
        })
        this.on('end', () => {
            this.client.removeListener('raw', this.rawEvent)
            this.client.setMaxListeners(this.client.getMaxListeners() - 1)
        })
    }
    setClient(client) {
        this.client = client
    }
    setFormat(format) {
        this.format = format
    }
    setEmbeds(embeds) {
        this.embedsChunked = chunk(embeds, this.maxItemsPerPage || 10)
        for (var i = 0; i < this.embedsChunked.length; i++) {
            this.pages.push(new Page(this.embedsChunked[i], i, this.embedsChunked.length))
        }
    }
    setMaxItemsPerPage(max) {
        this.maxItemsPerPage = max
    }
    setContent(content) {
        this.content = content
        this.contentChunked = chunk(content, this.maxItemsPerPage || 10)
        for (var i = 0; i < this.contentChunked.length; i++) {
            this.pages.push(new Page(this.contentChunked[i], i, this.contentChunked.length, this.format))
        }
    }
    setTTL(ttl) {
        this.ttl = ttl
    }
    turn(n) {
        this.index += n
        if (this.index < 0) this.index = 0
        if (this.index > this.pages.length - 1) this.index = this.pages.length - 1
    }
    update() {
        if (this.message) {
            this.message.edit({
                embed: this.pages[this.index].build()[0] || this.pages[this.index].build()
            })
        }
    }
    async build(message) {
        this.message = await message.channel.send({
            embed: this.pages[this.index].build()[0] || this.pages[this.index].build()
        })
        this.emit('start')


        if (this.ttl) setTimeout(() => {
            this.emit('end')
        }, this.ttl)
    }
}


module.exports.Pagination = Pagination;

function chunk(arr, chunkSize) {
    var R = [];
    for (var i = 0, len = arr.length; i < len; i += chunkSize)
        R.push(arr.slice(i, i + chunkSize));
    return R;
} 