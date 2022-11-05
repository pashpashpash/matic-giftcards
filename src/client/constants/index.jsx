// Shared Constants

const Constants = {
    contracts: {
        // ERC20: require('../../../contracts/ERC20.json'),
        REDEEMABLE_MATIC: "0x00000000000",
    },

    networks: {
        1: 'Ethereum',
        2: 'Morden',
        3: 'Ropsten',
        4: 'Rinkeby',
        42: 'Kovan',
        137: 'Polygon',
    },

    units: {
        weiInEth: 1000000000000000000,
        seedInEth: 10000,
    },

    numbers: {
        UINT32_MAX: 4294967295,
    },
};

export default Constants;