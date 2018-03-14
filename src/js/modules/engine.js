import symbols from './symbols';
import config from '../config';

function getRandomInt(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

class SlotMacnineEngine {
	constructor() {
		const self = this;
		this.config = {
			width: config.slotMachine.width || 3,
			height: config.slotMachine.height || 3,
			availableSymbols: symbols
		};

		this.reels = [];
		this.winlines = [];

		this.state = {
			privateState: {
				balance: 1000
			},
			publicState: {
				reels: this.reels,
				winlines: this.winlines
			}
		};

		this.api = {
			getConfig: () => {
				this.generateReels.call(this);
				return Promise.resolve(this.state);

			},
			spin: (linesToWin) => {
				this.generateReels.call(this, linesToWin);
				this.countWinLines.call(this);
				return Promise.resolve(self.state);
			}
		};
	}

	getRandomSymbol() {
		const index = getRandomInt(0, this.config.availableSymbols.length - 1);
		return this.config.availableSymbols[index].key;
	}

	generateSymbolOnReel(reel) {
		const newSymbol = this.getRandomSymbol();
		if (reel.indexOf(newSymbol) === -1) {
			return newSymbol;
		} else {
			return this.generateSymbolOnReel(reel);
		}
	}

	generateReels(linesToWin) {
		// Clear reel array to update view
		this.reels.splice(0);

		for (let i = 0; i < this.config.width; i++) {
			this.reels.push([]);
		}

		// If we need guaranteed win, put win lines firstly
		if (linesToWin) {
			const winSymbol = this.generateSymbolOnReel(this.reels[0]);
			for (let i = 0; i < linesToWin.length; i++) {
				for (let j = 0; j < this.config.width; j++) {
					this.reels[j][linesToWin[i]] = winSymbol;
				}
			}
		}

		for (let i = 0; i < this.config.width; i++) {
			for (let j = 0; j < this.config.height; j++) {
				if (!this.reels[i][j]) {
					this.reels[i][j] = this.generateSymbolOnReel(this.reels[i]);
				}
			}
		}
		return this.reels;
	}

	countWinLines() {
		this.winlines.splice(0);
		for (let i = 0; i < this.reels.length; i++) {
			const symbol = this.reels[0][i];
			let isWinLine = true;
			for (let j = 1; j < this.reels.length; j++) {
				if (this.reels[j][i] !== symbol) {
					isWinLine = false;
				}
			}
			if (isWinLine) {
				this.winlines.push(i);
			}
		}
	}
}

export default SlotMacnineEngine;