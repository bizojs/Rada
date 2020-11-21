const { ReactionCollector } = require('discord.js');

class ReactionHandler extends ReactionCollector {
	constructor(message, filter, options, display, emojis) {
		super(message, filter, options);
		this.display = display;
		this.methodMap = new Map(Object.entries(this.display.emojis).map(([key, value]) => [value, key]));
		this.currentPage = this.options.startPage || 0;
		this.awaiting = false;
		this.selection = this.display.emojis.zero ? new Promise((resolve, reject) => {
			this.reject = reject;
			this.resolve = resolve;
		}) : Promise.resolve(null);
		this.reactionsDone = false;
		if (emojis.length) this._queueEmojiReactions(emojis.slice());
		else return this.stop();
		this.on('collect', (reaction, user) => {
			reaction.users.remove(user);
			this[this.methodMap.get(reaction.emoji.id || reaction.emoji.name)](user);
		});
		this.on('end', () => {
			if (this.reactionsDone && !this.message.deleted) this.message.reactions.removeAll();
		});
	}
	first() {
		this.currentPage = 0;
		this.update();
	}
	back() {
		if (this.currentPage <= 0) return;
		this.currentPage--;
		this.update();
	}
	forward() {
		if (this.currentPage > this.display.pages.length - 1) return;
		this.currentPage++;
		this.update();
	}
	last() {
		this.currentPage = this.display.pages.length - 1;
		this.update();
	}
	info() {
		this.message.edit(this.display.infoPage);
	}
	stop() {
		if (this.resolve) this.resolve(null);
		super.stop();
	}
	zero() {
		if (this.display.options.length - 1 < this.currentPage * 10) return;
		this.resolve(this.currentPage * 10);
		this.stop();
	}
	one() {
		if (this.display.options.length - 1 < 1 + (this.currentPage * 10)) return;
		this.resolve(1 + (this.currentPage * 10));
		this.stop();
	}
	two() {
		if (this.display.options.length - 1 < 2 + (this.currentPage * 10)) return;
		this.resolve(2 + (this.currentPage * 10));
		this.stop();
	}
	three() {
		if (this.display.options.length - 1 < 3 + (this.currentPage * 10)) return;
		this.resolve(3 + (this.currentPage * 10));
		this.stop();
	}
	four() {
		if (this.display.options.length - 1 < 4 + (this.currentPage * 10)) return;
		this.resolve(4 + (this.currentPage * 10));
		this.stop();
	}
	five() {
		if (this.display.options.length - 1 < 5 + (this.currentPage * 10)) return;
		this.resolve(5 + (this.currentPage * 10));
		this.stop();
	}
	six() {
		if (this.display.options.length - 1 < 6 + (this.currentPage * 10)) return;
		this.resolve(6 + (this.currentPage * 10));
		this.stop();
	}
	seven() {
		if (this.display.options.length - 1 < 7 + (this.currentPage * 10)) return;
		this.resolve(7 + (this.currentPage * 10));
		this.stop();
	}
	eight() {
		if (this.display.options.length - 1 < 8 + (this.currentPage * 10)) return;
		this.resolve(8 + (this.currentPage * 10));
		this.stop();
	}
	nine() {
		if (this.display.options.length - 1 < 9 + (this.currentPage * 10)) return;
		this.resolve(9 + (this.currentPage * 10));
		this.stop();
	}
	update() {
		this.message.edit({ embed: this.display.pages[this.currentPage] });
	}
	async _queueEmojiReactions(emojis) {
		if (this.message.deleted) return this.stop();
		if (this.ended) return this.message.reactions.removeAll();
		await this.message.react(emojis.shift());
		if (emojis.length) return this._queueEmojiReactions(emojis);
		this.reactionsDone = true;
		return null;
	}
}

module.exports = ReactionHandler;
