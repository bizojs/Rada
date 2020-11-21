const { performance } = require('perf_hooks');

class Stopwatch {
	constructor(digits = 2) {
		this.digits = digits;
		this._start = performance.now();
		this._end = null;
	}
	get duration() {
		return this._end ? this._end - this._start : performance.now() - this._start;
	}
	get running() {
		return Boolean(!this._end);
	}
	restart() {
		this._start = performance.now();
		this._end = null;
		return this;
	}
	reset() {
		this._start = performance.now();
		this._end = this._start;
		return this;
	}
	start() {
		if (!this.running) {
			this._start = performance.now() - this.duration;
			this._end = null;
		}
		return this;
	}
	stop() {
		if (this.running) this._end = performance.now();
		return this;
	}
	toString() {
		const time = this.duration;
		if (time >= 1000) return `${(time / 1000).toFixed(this.digits)}s`;
		if (time >= 1) return `${time.toFixed(this.digits)}ms`;
		return `${(time * 1000).toFixed(this.digits)}μs`;
	}
}

module.exports = Stopwatch;
