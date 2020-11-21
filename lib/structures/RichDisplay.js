const { MessageEmbed: Embed } = require('discord.js');
const ReactionHandler = require('./ReactionHandler');

class RichDisplay {
	constructor(embed = new Embed()) {
		this.embedTemplate = embed;
		this.pages = [];
		this.infoPage = null;
		this.emojis = {
			first: '⏮',
			back: '◀',
			forward: '▶',
			last: '⏭',
			info: 'ℹ',
			stop: '⏹'
		};
		this.footered = false;
		this.footerPrefix = '';
		this.footerSuffix = '';
	}
	get template() {
		return new Embed(this.embedTemplate);
	}
	setEmojis(emojis) {
		Object.assign(this.emojis, emojis);
		return this;
	}
	setFooterPrefix(prefix) {
		this.footered = false;
		this.footerPrefix = prefix;
		return this;
	}
	setFooterSuffix(suffix) {
		this.footered = false;
		this.footerSuffix = suffix;
		return this;
	}
	useCustomFooters() {
		this.footered = true;
		return this;
	}
	addPage(embed) {
		this.pages.push(this._handlePageGeneration(embed));
		return this;
	}
	setInfoPage(embed) {
		this.infoPage = this._handlePageGeneration(embed);
		return this;
	}
	async run(message, options = {}) {
		if (!this.footered) this._footer();
		if (!options.filter) options.filter = () => true;
		const emojis = this._determineEmojis(
			[],
			!('stop' in options) || ('stop' in options && options.stop),
			!('firstLast' in options) || ('firstLast' in options && options.firstLast)
		);
		let msg;
		if (message.editable) {
			await message.edit({ embed: this.pages[options.startPage || 0] });
			msg = message;
		} else {
			msg = await message.channel.send(this.pages[options.startPage || 0]);
		}
		return new ReactionHandler(
			msg,
			(reaction, user) => emojis.includes(reaction.emoji.id || reaction.emoji.name) && user !== message.client.user && options.filter(reaction, user),
			options,
			this,
			emojis
		);
	}
	async _footer() {
		for (let i = 1; i <= this.pages.length; i++) this.pages[i - 1].setFooter(`${this.footerPrefix}${i}/${this.pages.length}${this.footerSuffix}`);
		if (this.infoPage) this.infoPage.setFooter('ℹ');
	}
	_determineEmojis(emojis, stop, firstLast) {
		if (this.pages.length > 1 || this.infoPage) {
			if (firstLast) emojis.push(this.emojis.first, this.emojis.back, this.emojis.forward, this.emojis.last);
			else emojis.push(this.emojis.back, this.emojis.forward);
		}
		if (this.infoPage) emojis.push(this.emojis.info);
		if (stop) emojis.push(this.emojis.stop);
		return emojis;
	}
	_handlePageGeneration(cb) {
		if (typeof cb === 'function') {
			const page = cb(this.template);
			if (page instanceof Embed) return page;
		} else if (cb instanceof Embed) {
			return cb;
		}
		throw new Error('Expected a MessageEmbed or Function returning a MessageEmbed');
	}
}

module.exports = RichDisplay;
