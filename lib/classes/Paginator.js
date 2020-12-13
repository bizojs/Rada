class Paginator {

    constructor(message) {
        this.msg = message;
        this.emojiList = [
            '⏪',                 // Skip to first page
            '742375771913453628', // Back one page
            '🗑️',                 // Remove all reactions
            '742375779656269914', // Forward one page
            '⏩'                  // Skip to last page
        ];
        this.timeout = 300000;
    }

    paginate = async (pages) => {
        let page = 0;
        if (pages.length === 1) {
            typeof pages[page] === 'object' ? 
                this.msg.util.send(pages[page].setFooter(`Requested by ${this.msg.author.username}`)) :
                this.msg.util.send(pages[page]);
            return;
        }
        const curPage = 
        typeof pages[page] === 'object' ? 
            await this.msg.util.send(pages[page].setFooter(`Page ${page + 1} of ${pages.length} | Requested by ${this.msg.author.username}`)) :
            await this.msg.util.send(`${pages[page]}\n\n*Page ${page + 1} of ${pages.length}*`);
        for (const emoji of this.emojiList) await curPage.react(emoji);
        const reactionCollector = curPage.createReactionCollector((reaction, user) => this.emojiList.includes(reaction.emoji.name) || this.emojiList.includes(reaction.emoji.id) && !user.bot && user.id === this.msg.author.id, { time: this.timeout });
        reactionCollector.on('collect', async reaction => {
            reaction.users.remove(this.msg.author);
            switch (reaction.emoji.id || reaction.emoji.name) {
                case this.emojiList[0]:
                    if (page !== 0) {
                        page = 0
                        typeof pages[page] === 'object' ?
                            curPage.edit(pages[page].setFooter(`Page ${page + 1} of ${pages.length} | Requested by ${this.msg.author.username}`)) :
                            curPage.edit(`${pages[page]}\n\n*Page ${page + 1} of ${pages.length}*`);
                    }
                break;
                case this.emojiList[1]:
                    page = page > 0 ? --page : pages.length - 1;
                    typeof pages[page] === 'object' ?
                        curPage.edit(pages[page].setFooter(`Page ${page + 1} of ${pages.length} | Requested by ${this.msg.author.username}`)) :
                        curPage.edit(`${pages[page]}\n\n*Page ${page + 1} of ${pages.length}*`);
                break;
                case this.emojiList[2]:
                    if (!reaction.message.deleted && this.msg.guild.me.permissions.has('MANAGE_MESSAGES')) {
                        await curPage.reactions.removeAll();
                    }
                    typeof pages[page] === 'object' ?
                        curPage.edit(pages[page].setFooter(`Pagination finished | Requested by ${this.msg.author.username}`)) :
                        curPage.edit(`${pages[page]}\n\n*Pagination finished*`);
                break;
                case this.emojiList[3]:
                    page = page + 1 < pages.length ? ++page : 0;
                    typeof pages[page] === 'object' ?
                        curPage.edit(pages[page].setFooter(`Page ${page + 1} of ${pages.length} | Requested by ${this.msg.author.username}`)) :
                        curPage.edit(`${pages[page]}\n\n*Page ${page + 1} of ${pages.length}*`);
                break;
                case this.emojiList[4]:
                    if (page !== pages.length-1) {
                        page = pages.length-1;
                        typeof pages[page] === 'object' ?
                            curPage.edit(pages[page].setFooter(`Page ${page + 1} of ${pages.length} | Requested by ${this.msg.author.username}`)) :
                            curPage.edit(`${pages[page]}\n\n*Page ${page + 1} of ${pages.length}*`);
                    }
                break;
            }
        });
        reactionCollector.on('end', async () => {
            if (!curPage.deleted && this.msg.guild.me.permissions.has('MANAGE_MESSAGES')) {
                await curPage.reactions.removeAll();
            }
            typeof pages[page] === 'object' ?
                curPage.edit(pages[page].setFooter(`Pagination finished | Requested by ${this.msg.author.username}`)) :
                curPage.edit(`${pages[page]}\n\n*Pagination finished*`);
        });
        return curPage;
    }
}

module.exports = Paginator;