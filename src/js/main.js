import SlotMacnineEngine from './modules/engine';
import SlotMachineView from './modules/slotMachine';
import symbols from './modules/symbols';
import config from './config';

function getRandomInt(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

new Vue({
	el: '#slot-machine',
	data: {
		symbols,
		states: config.slotMachineStates,
		engine: null,
		slotMachine: null
	},

	created: function() {
		this.engine = new SlotMacnineEngine();
		this.slotMachine = new SlotMachineView(this);

		this.engine.api.getConfig()
			.then((data) => this.slotMachine.updateData(data));
	},

	computed: {
		state: function() {
			return this.slotMachine ? this.slotMachine.state : config.slotMachineStates.DISABLED;
		},
		slotMachineHeight: function() {
			return config.slotMachine.height * config.slotMachine.symbolWidth;
		},
		slotMachineWidth: function() {
			return config.slotMachine.width * config.slotMachine.symbolWidth;
		},
		gameMode: function() {
			return config.gameMode;
		}
	},

	methods: {
		stop: function() {

			if (this.slotMachine.state !== config.slotMachineStates.SPIN) {
				return;
			}

			this.engine.api.spin().then((data) => {
				this.slotMachine.stop(data);
			});

		},
		spin: function() {
			if (this.slotMachine.state !== config.slotMachineStates.IDLE) {
				return;
			}

			this.slotMachine.spin();

			setTimeout(() => {
				if (this.slotMachine.state !== config.slotMachineStates.SPIN) {
					return;
				}
				this.engine.api.spin().then((data) => {
					this.slotMachine.stop(data);
				});
			}, getRandomInt(config.slotMachine.serverDelay.min, config.slotMachine.serverDelay.max));

		},

		getSymbolUrl: function(key) {
			for (let i = 0; i < this.symbols.length; i++) {
				if (this.symbols[i].key === key) {
					return this.symbols[i].url;
				}
			}
		}
	}
});