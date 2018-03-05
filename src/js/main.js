import SlotMacnineEngine from './modules/engine';
import symbols from './modules/symbols';

function getRandomInt(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

const slotMachineStates = {
	IDLE: 'idle',
	SPIN: 'spin'
};


new Vue({
	el: '#slot-machine',
	data: {
		config: {
			width: 3,
			height: 3,
			symbols,
			serverDelay: {
				min: 500,
				max: 1500
			}
		},
		engine: null,
		reels: [],
		balance: 0,
		winLines: [],
		slotMachine: {
			reels: []
		}
	},
	created: function() {
		this.engine = new SlotMacnineEngine(this.config);
		this.engine.api.getConfig().then((data) => {
			this.reels = data.publicState.reels;
			this.winLines = data.publicState.winlines;
			for (let i = 0; i < this.reels.length; i++) {
				this.slotMachine.reels.push({
					spinning: false
				});
			}
		});
	},
	methods: {
		spin: function(winlines = []) {
			// Start spinning reels
			this.toggleSpinAnimation()
				// Get reels from backend
				.then(() => this.engine.api.spin(winlines))
				// Spin reels to emulate server response
				.then((data) => {
					const spinningTimeout = getRandomInt(this.config.serverDelay.min, this.config.serverDelay.max);
					return new Promise((resolve) => {
						setTimeout(() => {
							this.reels = data.publicState.reels;
							this.winLines = data.publicState.winlines;
							resolve();
						}, spinningTimeout);
					});
				})
				// Stop reel animation
				.then(() => this.toggleSpinAnimation())
				// Set machine status
				.then(() => {
					console.log('animation end');
					this.slotMachine.state = slotMachineStates.IDLE;
				});
		},

		winSpin: function() {
			const linesToWin = [getRandomInt(0, this.config.height - 1)];
			this.spin(linesToWin);
		},


		toggleSpinAnimation: function() {
			const reels = this.slotMachine.reels;
			const timeouts = [];

			for (let i = 0; i < reels.length; i++) {
				if (i === 0) {
					reels[i].delay = 0;
				} else {
					reels[i].delay = getRandomInt(reels[i - 1].delay, reels[i - 1].delay + this.config.serverDelay.min);
				}

				timeouts.push((() => {
					return new Promise((resolve) => {
						setTimeout(() => {
							reels[i].spinning = !reels[i].spinning;
							resolve();
						}, reels[i].delay);
					});
				})());

			}

			return Promise.all(timeouts);
		},

		getSymbolUrl: function(key) {
			for (let i = 0; i < this.config.symbols.length; i++) {
				if (this.config.symbols[i].key === key) {
					return this.config.symbols[i].url;
				}
			}
		}
	}
});