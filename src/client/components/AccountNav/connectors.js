/* eslint-disable require-jsdoc */
/* eslint-disable func-style */
// @flow
import { useState, useEffect } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { PortisConnector } from '@web3-react/portis-connector';
import { useWeb3React } from '@web3-react/core';
import Portis from '../../../../secret/redeemable/portis';
import Infura from '../../../../secret/redeemable/infura.js';
// const POLLING_INTERVAL = 12000

const supportedChains = [137, 1, 56, 43114];

export const injected: any = new InjectedConnector({
    supportedChainIds: supportedChains,
});

export const portis: any = new PortisConnector({
    dAppId: Portis,
    networks: [137, 1],
    config: { scope: ['email'] },
});

export const walletconnect: any = new WalletConnectConnector({
    rpc: { 1: Infura },
    qrcode: true,
});


export function useEagerConnect(): boolean {
    const { activate, active } = useWeb3React();
    const [tried, setTried] = useState(false);

    useEffect(() => {
        injected.isAuthorized().then((isAuthorized: boolean) => {
            if (isAuthorized) {
                activate(injected, undefined, true).catch(() => {
                    setTried(true);
                });
            } else {
                setTried(true);
            }
        });
    }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))

    // if the connection worked, wait until we get confirmation of that to flip the flag
    useEffect(() => {
        if (!tried && active) {
            setTried(true);
        }
    }, [tried, active]);

    return tried;
}
