function getRandomInt(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

class SlotMacnineEngine {
	constructor(config) {
		this.config = {
			width: config.width || 3,
			height: config.height || 3,
			availableSymbols: config.symbols || ['A', 'K', 'Q', 'J', 'W']
		};
		this.reels = [];
		this.winlines = [];

		this.api = {
			spin: (linesToWin) => {
				this.generateReels.call(this, linesToWin);
				this.countWinLines.call(this);
				return Promise.resolve({
					reels: this.reels,
					winlines: this.winlines
				});
			}
		};
	}

	getRandomSymbol() {
		const index = getRandomInt(0, this.config.availableSymbols.length - 1);
		return this.config.availableSymbols[index];
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