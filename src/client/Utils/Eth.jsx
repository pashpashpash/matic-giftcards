/* eslint-disable flowtype/no-weak-types */
// @flow

const Eth = {
    // eslint-disable-next-line flowtype/no-types-missing-file-annotation
    estimateGasPrice: (web3: any): any =>
        new Promise((resolve: any, reject: any) => {
            web3.eth
                .getGasPrice()
                .then((gas: number) => {
                    const goodGas = Math.max(
                        35000000000,
                        Math.floor(parseInt(gas, 10) * 1.2 + 5000000000)
                    );
                    console.log('GAS: ' + goodGas);
                    resolve(goodGas);
                })
                .catch((err: Error) => {
                    console.log('web3 Gas error', err);
                    reject(err);
                });
        }),
};

export default Eth;
