const { getPromiseDetails } = process.binding('util');

class Type {
	constructor(value, parent = null) {
		this.value = value;
		this.is = this.constructor.resolve(value);
		this.parent = parent;
		this.childKeys = new Map();
		this.childValues = new Map();
	}
	get childTypes() {
		if (!this.childValues.size) return '';
		return `<${(this.childKeys.size ? `${this.constructor.list(this.childKeys)}, ` : '') + this.constructor.list(this.childValues)}>`;
	}
	toString() {
		this.check();
		return this.is + this.childTypes;
	}
	addValue(value) {
		const child = new this.constructor(value, this);
		this.childValues.set(child.is, child);
	}
	addEntry([key, value]) {
		const child = new this.constructor(key, this);
		this.childKeys.set(child.is, child);
		this.addValue(value);
	}
	*parents() {
		let current = this;
		while (current = current.parent) yield current;
	}
	check() {
		if (Object.isFrozen(this)) return;
		const promise = getPromiseDetails(this.value);
		if (typeof this.value === 'object' && this.isCircular()) this.is = `[Circular:${this.is}]`;
		else if (promise && promise[0]) this.addValue(promise[1]);
		else if (this.value instanceof Map) for (const entry of this.value) this.addEntry(entry);
		else if (Array.isArray(this.value) || this.value instanceof Set) for (const value of this.value) this.addValue(value);
		else if (this.is === 'Object') this.is = 'any';
		Object.freeze(this);
	}
	isCircular() {
		for (const parent of this.parents()) if (parent.value === this.value) return true;
		return false;
	}
	static resolve(value) {
		const type = typeof value;
		switch (type) {
			case 'object': return value === null ? 'null' : (value.constructor && value.constructor.name) || 'any';
			case 'function': return `${value.constructor.name}(${value.length}-arity)`;
			case 'undefined': return 'void';
			default: return type;
		}
	}
	static list(values) {
		return values.has('any') ? 'any' : [...values.values()].sort().join(' | ');
	}
}

module.exports = Type;
