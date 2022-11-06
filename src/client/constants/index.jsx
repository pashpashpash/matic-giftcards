// Shared Constants
import RedeemableNative from '../../../contracts/compiled/RedeemableNative.json';
const Constants = {
    contracts: {
        RedeemableNative,
        REDEEMABLENATIVE_ADDRESS: '0xC9b8F651c1D86cB3C4408755Af1340295c3441F5',
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
        geiInETH: 1000000000,
    },

    numbers: {
        UINT32_MAX: 4294967295,
    },
};

export default Constants;
