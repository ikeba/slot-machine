import config from '../config';

class Reel {
	constructor(symbols) {
		this.spinningSpeed = config.slotMachine.spinSpeed;
		this.reelSpinMargin = config.slotMachine.reelMargin;
		this.height = config.slotMachine.height;
		this.symbolSize = config.slotMachine.symbolWidth;
		this.availableSymbols = symbols;

		this.spinningState = config.spinningStates.IDLE;
		this.position = 0;
		this.symbols = [];
	
		this.reelHeight = this.height * this.symbolSize;
		this.reelTapeHeight = this.availableSymbols.length * this.symbolSize;
	}

	isIdle() {
		return this.spinningState === config.spinningStates.IDLE;
	}

	spin() {
		this.spinningState = config.spinningStates.STARTING;
	}

	stop() {
		this.spinningState = config.spinningStates.STOPPING;
	}

	animate() {
		if (this.spinningState === config.spinningStates.STARTING) {
			this.position -= config.slotMachine.startingSpeed;
			if (this.position <= -this.reelSpinMargin) {
				this.spinningState = config.spinningStates.SPINNING;
			}
		}
		if (this.spinningState === config.spinningStates.SPINNING) {
			if (this.position >= this.reelTapeHeight + this.reelHeight) {
				this.position = this.reelHeight;
			}
			this.position += this.spinningSpeed;
		}
		if (this.spinningState === config.spinningStates.STOPPING) {
			if (this.position >= this.reelTapeHeight * 2 + this.reelHeight) {
				this.position = 0;
				this.spinningState = config.spinningStates.IDLE;
				return;
			}
			this.position += this.spinningSpeed;
		}
	}
}

export default Reel;