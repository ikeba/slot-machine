import config from '../config';
import Reel from './reel';

class SlotMachineView {
	constructor(app) {
		this.app = app;
		this.reelsCount = config.slotMachine.width;
		this.symbolCount = config.slotMachine.height;
		this.balance = 0;
		this.reels = [];
		this._state = config.slotMachineStates.IDLE;

		this.initialize();
	}

	set state(state) {
		console.log('New State: ', state);
		this._state = state;
	}

	get state() {
		return this._state;
	}

	initialize() {
		for (let i = 0; i < config.slotMachine.width; i++) {
			this.reels.push(new Reel(this.app.symbols));
		}
		this.animate();
	}

	updateData(data) {
		this.balance = data.privateState.balance;
		for (let i = 0; i < this.reels.length; i++) {
			this.reels[i].symbols = data.publicState.reels[i];
		}
	}

	spin() {
		this.state = config.slotMachineStates.SPIN;
		for (let i = 0; i < this.reelsCount; i++) {
			const delay = i * 200;
			setTimeout(() => { this.reels[i].spin(); }, delay);
		}
	}

	stop(data) {
		this.state = config.slotMachineStates.STOPPING;
		this.updateData(data);

		for (let i = 0; i < this.reelsCount; i++) {
			this.reels[i].stop();
		}
	}

	animate() {
		if (this.state !== config.slotMachineStates.IDLE) {
			for (let i = 0; i < this.reelsCount; i++) {
				this.reels[i].animate();
			}
			if (this.state === config.slotMachineStates.STOPPING) {
				if (this.reels.filter(reel => !reel.isIdle()).length === 0) {
					this.state = config.slotMachineStates.IDLE;
				}
			}
		}
		
		requestAnimationFrame(this.animate.bind(this));
	}
}

export default SlotMachineView;