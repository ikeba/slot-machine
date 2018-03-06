import SlotMacnineEngine from './modules/engine';
import symbols from './modules/symbols';

function getRandomInt(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

const slotMachineStates = {
	IDLE: 'idle',
	SPIN: 'spin',
	STOPPING: 'stopping'
};

class Reel {
	constructor() {
		this.spinning = false;
		this.position = 0;
		this.symbols = [];
	}
	spin() {
		this.spinning = true;
	}
	stop() {
		this.spinning = false;
	}
}

function parseData(slotMachine, data) {
	console.log(data);
	slotMachine.balance = data.privateState.balance;

	for (let i = 0; i < slotMachine.reels.length; i++) {
		slotMachine.reels[i].symbols = data.publicState.reels[i];
	}
}

function startAnimation(slotMachine) {
	const reels = slotMachine.reels;
	for (let i = 0; i < reels.length; i++) {
		reels[i].spin();
	}
	return Promise.resolve();
}

const app = new Vue({
	el: '#slot-machine',
	data: {
		config: {
			width: 4,
			height: 3,
			symbols,
			speed: 20,
			serverDelay: {
				min: 2000,
				max: 4000
			}
		},
		states: slotMachineStates,
		engine: null,
		slotMachine: {
			balance: 0,
			reels: [],
			state: slotMachineStates.IDLE
		}
	},

	created: function() {
		this.engine = new SlotMacnineEngine(this.config);

		for (let i = 0; i < this.config.width; i++) {
			this.slotMachine.reels.push(new Reel());
		}

		this.engine.api.getConfig()
			.then((data) => parseData(this.slotMachine, data));
	},

	computed: {
		state: function() {
			return this.slotMachine.state;
		},
		slotMachineHeight: function() {
			return this.config.height * 160;
		}
	},
	methods: {
		spin: function(winlines) {
			if (this.slotMachine.state !== slotMachineStates.IDLE) {
				return;
			}

			this.slotMachine.state = slotMachineStates.SPIN;

			startAnimation(this.slotMachine)
				// Get reels from backend
				.then(() => this.engine.api.spin(winlines))
				// Spin reels to emulate server response
				.then((data) => {
					const spinningTimeout = getRandomInt(this.config.serverDelay.min, this.config.serverDelay.max);
					return new Promise((resolve) => {
						setTimeout(() => {
							parseData(this.slotMachine, data);
							resolve();
						}, spinningTimeout);
					});
				})
				// Set machine status
				.then(() => {
					this.slotMachine.state = slotMachineStates.STOPPING;
				});
		},

		winSpin: function() {
			if (this.slotMachine.state !== slotMachineStates.IDLE) {
				return;
			}
			const linesToWin = [getRandomInt(0, this.config.height - 1)];
			this.spin(linesToWin);
		},

		getSymbolUrl: function(key) {
			for (let i = 0; i < this.config.symbols.length; i++) {
				if (this.config.symbols[i].key === key) {
					return this.config.symbols[i].url;
				}
			}
		}
	},
	watch: {
		state: function(newValue) {
			const self = this;
			function spin() {
				for (let i = 0; i < self.slotMachine.reels.length; i++) {
					const reel = self.slotMachine.reels[i];
					if (reel.spinning) {
						reel.position += self.config.speed;
						
						if (self.state === slotMachineStates.SPIN) {
							if (reel.position >= self.config.symbols.length * 160) {
								reel.position = 0;
							}
						} else if (self.state === slotMachineStates.STOPPING) {
							const symbolsReelLength = self.config.symbols.length * 160 * 2;
							
							if (reel.position % symbolsReelLength === 0) {
								reel.stop();
							}
						}
					} 
				}

				const spinningReelsCount = self.slotMachine.reels.filter((el) => el.spinning).length;
				
				if (spinningReelsCount === 0) {
					self.slotMachine.state = slotMachineStates.IDLE;
				}

				if (self.state !== slotMachineStates.IDLE) {
					requestAnimationFrame(spin);
				}
			}

			if (newValue === slotMachineStates.SPIN) {
				spin();
			}
		}
	}
});