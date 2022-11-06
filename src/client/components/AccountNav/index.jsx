// @flow
import * as React from 'react';
import { useWeb3React } from '@web3-react/core';
import { useEagerConnect, injected } from './connectors';

import Constants from '../../Constants';

import s from './index.less';

const ANIMATION_LENGTH = 20000;

const prettyEthAccount = (account: string, chunkSize: ?number): string => {
    chunkSize = chunkSize || 4;
    const len = account.length;
    return (
        account.slice(0, chunkSize + 2) + '...' + account.slice(len - chunkSize)
    );
};

const AccountNav = (): React.Node => {
    const web3react = useWeb3React();
    const tried = useEagerConnect();
    const { account, chainId, active, activate, library } = web3react;

    const [balance, setBalance] = React.useState(null);
    const [greenShift, setGreenShift] = React.useState(false);
    const [redShift, setRedShift] = React.useState(false);

    React.useEffect(() => {
        if (!library) {
            return;
        }

        const intervalId = setInterval(() => {
            library.eth.getBalance(account, (err: Error, result: string) => {
                if (err) {
                    console.log('WEB3 error fetching balance', err);
                } else {
                    const newBalance = parseFloat(
                        library.utils.fromWei(result, 'ether')
                    ).toFixed(2);

                    if (balance !== newBalance) {
                        setBalance(newBalance);
                        console.log('>>> Updated balance!', {
                            balance,
                            newBalance,
                        });

                        if (balance != null) {
                            if (newBalance > balance) {
                                // don't do update animation on first load
                                setGreenShift(true);
                                setTimeout(() => {
                                    setGreenShift(false);
                                }, ANIMATION_LENGTH);
                            } else {
                                // don't do update animation on first load
                                setRedShift(true);
                                setTimeout(() => {
                                    setRedShift(false);
                                }, ANIMATION_LENGTH);
                            }
                        }
                    }
                }
            });
        }, 1000);

        return () => clearInterval(intervalId); // This is important
    }, [library, balance, setBalance, account]);

    const handleClick = React.useCallback(() => {
        if (!activate) {
            console.log('[AccountNav] Error Activate undefined');
        }
        if (active) return;
        activate(injected, (error: Error) => {
            console.log('[AccountNav] Error inside activate function', {
                error,
            });
        })
            .then((res): any => {})
            .catch((err: Error): any => {
                console.log('[AccountNav] Error activating connector', err);
            });
    }, [activate, active]);

    let prettyAccount = 'Connect Wallet';

    if (account != null) {
        prettyAccount = prettyEthAccount(account, 6);
    }

    const slideInStyle = {
        right: '-400px',
    };

    const network = Constants.networks[chainId];
    const transactions = [{ tx: '1' }];

    const balanceText = balance != null && balance + ' MATIC';
    return (
        <div className={s.accountNavWrap}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                    className={[
                        s.balance,
                        greenShift && s.updatingUp,
                        redShift && s.updatingDown,
                    ].join(' ')}>
                    {balanceText}
                </div>

                <div className={s.main}>
                    <div
                        className={s.accountNav}
                        onClick={handleClick}
                        data-category="Header Account Nav"
                        data-action={'Account ' + account}>
                        <div className={s.account}>{prettyAccount}</div>
                    </div>
                </div>
            </div>
            <div
                className={[s.subnav, s.network].join(' ')}
                style={slideInStyle}>
                Network: {network || '...'}
            </div>
            {greenShift && (
                <div className={s.fullscreenAnimation}>
                    <div className={s.confetti}></div>
                    <div className={s.confetti}></div>
                    <div className={s.confetti}></div>
                    <div className={s.confetti}></div>
                    <div className={s.confetti}></div>
                    <div className={s.confetti}></div>
                    <div className={s.confetti}></div>
                    <div className={s.confetti}></div>
                    <div className={s.confetti}></div>
                    <div className={s.confetti}></div>
                </div>
            )}
        </div>
    );
};

export default AccountNav;
