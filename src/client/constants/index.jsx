// Shared Constants
import RedeemableNative from '../../../contracts/compiled/RedeemableNative.json';
const Constants = {
    contracts: {
        RedeemableNative,
    },

    addresses: {
        RedeemableNative: '0xC9b8F651c1D86cB3C4408755Af1340295c3441F5',
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

    getTypedMetaTransactionData: ({
        name,
        version,
        chainId,
        verifyingContract,
        nonce,
        from,
        functionSignature,
    }) => {
        return {
            types: {
                EIP712Domain: [
                    {
                        name: 'name',
                        type: 'string',
                    },
                    {
                        name: 'version',
                        type: 'string',
                    },
                    {
                        name: 'verifyingContract',
                        type: 'address',
                    },
                    {
                        name: 'salt',
                        type: 'bytes32',
                    },
                ],
                MetaTransaction: [
                    {
                        name: 'nonce',
                        type: 'uint256',
                    },
                    {
                        name: 'from',
                        type: 'address',
                    },
                    {
                        name: 'functionSignature',
                        type: 'bytes',
                    },
                ],
            },
            domain: {
                name,
                version,
                verifyingContract,
                salt: '0x' + chainId.toString(16).padStart(64, '0'),
            },
            primaryType: 'MetaTransaction',
            message: {
                nonce: '0x' + nonce.toString(16),
                from,
                functionSignature,
            },
        };
    },
    getExplorerUrl: (chainId: number, txHash: string): string => {
        return `https://${
            chainId !== 137 ? 'etherscan.io' : 'polygonscan.com'
        }/tx/${txHash ?? 'null'}`;
    },
};

export default Constants;
