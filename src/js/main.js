import SlotMacnineEngine from './modules/engine';

function getRandomInt(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

// Application itself

new Vue({
	el: '#slot-machine',
	data: {
		engine: null,
		reels: [],
		config: {
			width: 3,
			height: 3,
			symbols: ['CHERRY', 'LEMON', 'WILD', 'APPLE', 'BERRY', 'ORANGE']
		},
		winLines: [],
		slotMachine: {
			reels: []
		}
	},
	created: function() {
		this.engine = new SlotMacnineEngine(this.config);
		this.engine.api.spin()
			.then((data) => {
				this.reels = data.reels;
				this.winLines = data.winlines;
				for (let i = 0; i < this.reels.length; i++) {
					this.slotMachine.reels.push({
						spinning: false
					});
				}
			});
	},
	methods: {
		toggleRandomSpin: function() {
			this.engine.api.spin()
				.then((data) => {
					this.reels = data.reels;
					this.winLines = data.winlines;
				});
		},
		toogleWinSpin: function() {
			const linesToWin = [getRandomInt(0, this.config.height - 1)];
			this.engine.api.spin(linesToWin)
				.then((data) => {
					this.reels = data.reels;
					this.winLines = data.winlines;
				});
		},
		toggleSpinAnimation: function() {
			const reels = this.slotMachine.reels;
			for (let i = 0; i < reels.length; i++) {
				if (i === 0) {
					reels[i].delay = 0;
				} else {
					reels[i].delay = getRandomInt(reels[i - 1].delay, reels[i - 1].delay + 500);
				}
				setTimeout(() => {
					reels[i].spinning = !reels[i].spinning;
				}, reels[i].delay);
			}
		}
	}
});