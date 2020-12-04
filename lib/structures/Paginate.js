const paginate = async (msg, pages, emojiList = ['⏪', '742375771913453628', '🗑️', '742375779656269914', '⏩'], timeout = 120000) => {
	let page = 0;
    const curPage = 
    typeof pages[page] === 'object' ? 
        await msg.channel.send(pages[page].setFooter(`Page ${page + 1} of ${pages.length} | Requested by ${msg.author.username}`)) :
        await msg.channel.send(`${pages[page]}\n\n*Page ${page + 1} of ${pages.length}*`);
	for (const emoji of emojiList) await curPage.react(emoji);
	const reactionCollector = curPage.createReactionCollector((reaction, user) => emojiList.includes(reaction.emoji.name) || emojiList.includes(reaction.emoji.id) && !user.bot, { time: timeout });
	reactionCollector.on('collect', async reaction => {
		reaction.users.remove(msg.author);
		switch (reaction.emoji.id || reaction.emoji.name) {
			case emojiList[0]:
                if (page !== 0) {
                    page = 0
                    typeof pages[page] === 'object' ?
                        curPage.edit(pages[page].setFooter(`Page ${page + 1} of ${pages.length} | Requested by ${msg.author.username}`)) :
                        curPage.edit(`${pages[page]}\n\n*Page ${page + 1} of ${pages.length}*`);
                }
            break;
			case emojiList[1]:
                page = page > 0 ? --page : pages.length - 1;
                typeof pages[page] === 'object' ?
                    curPage.edit(pages[page].setFooter(`Page ${page + 1} of ${pages.length} | Requested by ${msg.author.username}`)) :
                    curPage.edit(`${pages[page]}\n\n*Page ${page + 1} of ${pages.length}*`);
            break;
            case emojiList[2]:
                if (!reaction.message.deleted && msg.guild.me.permissions.has('MANAGE_MESSAGES')) {
                    await curPage.reactions.removeAll()
                }
                typeof pages[page] === 'object' ?
                    curPage.edit(pages[page].setFooter(`Pagination finished | Requested by ${msg.author.username}`)) :
                    curPage.edit(`${pages[page]}\n\n*Pagination finished*`);
            break;
            case emojiList[3]:
                page = page + 1 < pages.length ? ++page : 0;
                typeof pages[page] === 'object' ?
                    curPage.edit(pages[page].setFooter(`Page ${page + 1} of ${pages.length} | Requested by ${msg.author.username}`)) :
                    curPage.edit(`${pages[page]}\n\n*Page ${page + 1} of ${pages.length}*`);
            break;
            case emojiList[4]:
                if (page !== pages.length-1) {
                    page = pages.length-1;
                    typeof pages[page] === 'object' ?
                        curPage.edit(pages[page].setFooter(`Page ${page + 1} of ${pages.length} | Requested by ${msg.author.username}`)) :
                        curPage.edit(`${pages[page]}\n\n*Page ${page + 1} of ${pages.length}*`);
                }
            break;
        }
	});
	reactionCollector.on('end', async () => {
		if (!curPage.deleted && msg.guild.me.permissions.has('MANAGE_MESSAGES')) {
			await curPage.reactions.removeAll()
        }
        typeof pages[page] === 'object' ?
            curPage.edit(pages[page].setFooter(`Pagination finished | Requested by ${msg.author.username}`)) :
            curPage.edit(`${pages[page]}\n\n*Pagination finished*`);
	});
	return curPage;
};
module.exports = paginate;