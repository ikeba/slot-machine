const _reels = [];
const _winLines = [];
const _availableSymbols = ['CHERRY', 'LEMON', 'WILD', 'APPLE', 'BERRY', 'ORANGE'];
const _defaultConfig = {
    width: 3,
    height: 3
};

function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

function getRandomSymbol() {
    return _availableSymbols[getRandomInt(0, _availableSymbols.length - 1)];
}

function generateSymbolOnReel(reel) {
    const newSymbol = getRandomSymbol();
    if (reel.indexOf(newSymbol) === -1) {
        return newSymbol;
    } else {
        return generateSymbolOnReel(reel);
    }
}

function generateReels(params = {}) {
    const width = params.width || 3;
    const height = params.height || 3;

    _reels.splice(0);

    for (let i = 0; i < width; i++) {
        _reels.push([]);
    }

    if (params.winLines) {
        const winSymbol = generateSymbolOnReel(_reels[0]);
        for (let i = 0; i < params.winLines.length; i++) {
            for (let j = 0; j < width; j++) {
                _reels[j][params.winLines[i]] = winSymbol;
            }
        }
    }

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (!_reels[i][j]) {
                _reels[i][j] = generateSymbolOnReel(_reels[i]);
            }
        }
        console.log(_reels[i]);
    }
}

function countWinLines() {
    const width = _reels.length;
    const height = _reels[0].length;

    _winLines.splice(0);

    for (let i = 0; i < height; i++) {
        const symbol = _reels[0][i];
        let isWinLine = true;
        for (let j = 1; j < width; j++) {
            if (_reels[j][i] !== symbol) {
                isWinLine = false;
            }
        }
        if (isWinLine) {
            _winLines.push(i);
        }
    }
}

// Application itself

const app = new Vue({
    el: '#slot-machine',
    data: {
        reels: _reels,
        config: _defaultConfig,
        winLines: _winLines
    },
    created: function () {
        generateReels(this.config);
    },
    methods: {
        toggleRandomSpin: function () {
            generateReels(this.config);
            countWinLines();
        },
        toogleWinSpin: function () {
            const winConfig = Object.assign({
                winLines: [getRandomInt(0, _defaultConfig.height - 1)]
            }, this.config);
            generateReels(winConfig);
            countWinLines();
        }
    }
});