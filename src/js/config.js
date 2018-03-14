export default {

	gameMode: 'debug',

	slotMachine: {
		width: 3,
		height: 3,
		symbolWidth: 160,
		serverDelay: {
			min: 1000,
			max: 3000
		},
		spinSpeed: 30,
		reelMargin: 40,
		startingSpeed: 5
	},

	slotMachineStates: {
		IDLE: 'idle',
		SPIN: 'spin',
		STOPPING: 'stopping',
		DISABLED: 'null'
	},
	
	spinningStates: {
		STARTING: 'starting',
		SPINNING: 'spinning',
		STOPPING: 'stopping',
		IDLE: 'idle'
	}
};